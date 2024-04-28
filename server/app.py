#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Team, Tournament, Game, GameScore, Stage
from scheduling_helpers import generate_best_pool_schedule, add_game_timing

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
            return make_response(tournament.to_dict(), 200)
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

            return make_response({
                "matchups": matchups_schedule,
                "timeslots": start_times
            }, 200)
        # elif data.get("type") == "bracket":
        #     pass
        

api.add_resource(GenerateGameSchedule, '/generate_schedule')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

