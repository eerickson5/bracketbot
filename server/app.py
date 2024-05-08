#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Team, Tournament, Game, GameScore, Stage

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class TeamByID(Resource):
    def get(self, id):
        team = Team.query.filter(Team.id == id).first()
        if team:
            return make_response(team.to_dict(), 200)
        else:
            return make_response("No team exists with that id", 404)
api.add_resource(TeamByID, '/team/<int:id>')
        
class CreateTeam(Resource):
    def post(self):
        # if session["user_id"]:
        try:
            team = Team(
                team_name=request.json.get("teamName"),
                image=request.json.get("image"),
                #captain_id=session["user_id"]
            )
            db.session.add(team)
            db.session.commit()
            return make_response(team.to_dict(), 201)
        except ValueError as e:
            return make_response( {"message": str(e)}, 422)
    # else:
    #     return make_response({"error": "Not logged in"}, 401)
api.add_resource(CreateTeam, '/team')


class TournamentByID(Resource):
    def get(self, id):
        tournament = Tournament.query.filter(Tournament.id == id).first()
        if tournament:
            team_dict = {}
            for team in tournament.teams:
                team_dict[team.id] = team.to_dict()
            return make_response({"tournament": tournament.to_dict(), "teams": team_dict}, 200)
        else:
            return make_response("No tournament exists with that id", 404)
        
    def patch(self, id):
        tournament = Tournament.query.filter(Tournament.id == id).first()
        if tournament:
            if request.json.get("operation") == "rationalize_teams":
                tournament.rationalize_teams(request.json.get("teams"))
            else:
                for attr in request.json:
                    setattr(tournament, attr, request.json.get(attr))
                db.session.add(tournament)
                db.session.commit()
            return make_response(tournament.to_dict(), 200)
        else:
            return make_response({"error": "No tournament exists with that ID."}, 404)
api.add_resource(TournamentByID, '/tournament/<int:id>')

class CreateTournament(Resource):
    def post(self):
        # if session["user_id"]:
        try:
            tournament = Tournament(
                name=request.json.get("tournamentName"),
                image=request.json.get("image"),
            )
            db.session.add(tournament)
            teams = [Team(
                team_name=item["team_name"],
                image=item["image"]
            ) for item in request.json.get("teams")]
            for team in teams:
                db.session.add(team)
                tournament.teams.append(team)
            db.session.commit()
            return make_response(tournament.to_dict(), 201)
        except ValueError as e:
            return make_response( {"message": str(e)}, 422)
    # else:
    #     return make_response({"error": "Not logged in"}, 401)
api.add_resource(CreateTournament, '/tournament')

class GenerateGameSchedule(Resource):
    def post(self):
        from scheduling_helpers import generate_best_pool_schedule, add_game_timing
        data = request.json
        if data.get("type") == "pool":
            matchups_schedule = generate_best_pool_schedule(
                data.get("team_lists"),
                data.get("num_fields"),
                data.get("crossovers_allowed"),
                10
            )

            from datetime import time
            start_time = time(data.get("start_hours"), data.get("start_minutes"))

            start_times = add_game_timing(
                len(matchups_schedule),
                start_time,
                data.get("game_length"),
                data.get("break_length")
            )

            team_pools = {}
            i = 1
            for pool in data.get("team_lists"):
                for team in pool:
                    team_pools[team] = i
                i += 1


            #map teams to pools

            return make_response({
                "matchups": matchups_schedule,
                "timeslots": start_times,
                "teamPools": team_pools
            }, 200)
        # elif data.get("type") == "bracket":
        #     pass
api.add_resource(GenerateGameSchedule, '/generate_schedule')

class AcceptSchedule(Resource):
    def post(self):
        from scheduling_helpers import map_matchups
        from datetime import datetime
        data = request.json
        tournament_id = data.get("tournamentId")
        if data.get("type") == "pool":
            tournament = Tournament.query.filter(Tournament.id == tournament_id).first()
            if len(tournament.stages) > 0:
                return make_response({"error": "This tournament already has pools."}, 400)
            
            timeslots = data.get("timeslots")

            crossover_pool = Stage(
                is_bracket = False,
                tournament_id = tournament_id,
                name = f"Crossovers",
                start_time = datetime.strptime(timeslots[0], '%I:%M %p'),
                #hold a string in the DB instead
            )
            db.session.add(crossover_pool)
            stages = [crossover_pool]

            letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I" ,"J"]
            i = 0
            for _ in range(data.get("numStages")):
                stage = Stage(
                    is_bracket = False,
                    tournament_id = tournament_id,
                    name = f"Pool {letters[i]}",
                    start_time = datetime.strptime(timeslots[0], '%I:%M %p'),
                )
                db.session.add(stage)
                stages.append(stage)
                i += 1
            
            db.session.commit()

            mapped_matchups = map_matchups(data.get("matchups"), timeslots, data.get("teamPools"))
            for matchup in mapped_matchups:
                matchup["game"] = Game(
                    location= matchup["location"],
                    start_time = matchup["start_time"],
                    stage = stages[matchup["pool_index"]]
                )
                db.session.add(matchup["game"])

            db.session.commit()

            for matchup in mapped_matchups:
                matchup["game_score_1"] = GameScore(
                    team_id=matchup["matchup"][0],
                    game = matchup["game"]
                    )
                matchup["game_score_2"] = GameScore(
                    team_id=matchup["matchup"][1],
                    game = matchup["game"]
                    )
                db.session.add(matchup["game_score_1"])
                db.session.add(matchup["game_score_2"])

            db.session.commit()
            
            return make_response({
                "stages": [stage.to_dict() for stage in stages]
            }, 201)

            ##TODO: don't serialize Game -> Team -> Gamescore
            ## fix location in games
api.add_resource(AcceptSchedule, '/accept_schedule')

class GameScoreByID(Resource):
    def patch(self, id):
        game_score = GameScore.query.filter(GameScore.id == id).first()
        if game_score and game_score.team_id == request.json.get("team_id"):
            game_score.own_score = request.json.get("new_score")
            db.session.add(game_score)
            db.session.commit()
        return make_response(game_score.to_dict(), 200)
api.add_resource(GameScoreByID, '/game_score/<int:id>')

class PoolsAreComplete(Resource):
    def get(self, id):
        from sqlalchemy.orm import joinedload
        stages = db.session.query(Stage).filter(Stage.tournament_id == id, Stage.is_bracket == False).all()
        if stages:
            for stage in stages:
                if not stage.all_games_scored():
                    return make_response({"completed": False}, 200)
            return make_response({"completed": True}, 200)
        else:
            return make_response({"error": "Tournament has no pools."}, 400)

api.add_resource(PoolsAreComplete, '/pools_completed/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

