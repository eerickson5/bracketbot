#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api
# Add your model imports
from models import Team, Tournament, Game, GameScore, Stage, User

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
        
    def delete(self, id):
        tournament = Tournament.query.filter(Tournament.id == id).first()
        if tournament:
            db.session.delete(tournament)
            db.session.commit()
        return make_response({}, 200)
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

class TournamentsByUser(Resource):
    def get(self):
        print("running get ")
        user_id = session["user_id"]
        tournaments = Tournament.query.filter(Tournament.user_id == user_id).all()
        return make_response({"tournaments" : [t.to_dict() for t in tournaments]}, 200)
api.add_resource(TournamentsByUser, "/my_tournaments")

class GenerateGameSchedule(Resource):
    def post(self):
        from algorithms.pool_algorithms import generate_best_pool_schedule
        from algorithms.shared_algorithms import add_game_timing
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
        data = request.json
        tournament = Tournament.query.filter(Tournament.id == data.get("tournamentId")).first()

        if data.get("type") == "pool":
            if len(tournament.pools) > 0:
                return make_response({"error": "This tournament already has pools."}, 400)
            else:
                from algorithms.pool_algorithms import accept_pool_schedule
                stages = accept_pool_schedule(data)
                return make_response({
                    "stages": [stage.to_dict() for stage in stages]
                }, 201)
            
        elif data.get("type") == "bracket":
            if len(tournament.brackets) > 0:
                return make_response({"error": "This tournament already has a bracket."}, 400)
            else:
                from algorithms.bracket_algorithms import generate_bracket
                bracket = generate_bracket(tournament, data)
                return make_response({
                    "bracket": bracket.to_dict()
                }, 201)
        
        else:
            return make_response({"message": "Invalid type."}, 400)
api.add_resource(AcceptSchedule, '/accept_schedule')

class GameScoreByID(Resource):
    def patch(self, id):
        game_score = GameScore.query.filter(GameScore.id == id).first()
        if game_score and game_score.team_id == request.json.get("team_id"):
            game_score.own_score = request.json.get("new_score")
            db.session.add(game_score)
            if(game_score.game.next_game):
                game_score.game.assign_next_game_to_winner()
                #TODO: return next game's game_score so the ui updates immediately
            db.session.commit()
        return make_response(game_score.to_dict(), 200)
api.add_resource(GameScoreByID, '/game_score/<int:id>')

class PoolsAreComplete(Resource):
    def get(self, id):
        stages = db.session.query(Stage).filter(Stage.tournament_id == id, Stage.is_bracket == False).all()
        if stages:
            for stage in stages:
                if not stage.all_games_scored():
                    return make_response({"completed": False}, 200)
            return make_response({"completed": True}, 200)
        else:
            return make_response({"completed": False}, 200)
api.add_resource(PoolsAreComplete, '/pools_completed/<int:id>')

class Login(Resource):
    def post(self):
        user = User.query.filter(User.email == request.json.get('email')).first()
        if user and user.authenticate(request.json.get('password')):
            session['user_id'] = user.id
            return make_response(user.to_dict(), 200)
        else:
            return make_response({"message": "No user with this email found."}, 401)
api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({"message": "successfully logged out"}, 204)
api.add_resource(Logout, '/logout')

class SignUp(Resource):
    def post(self):
        try:
            user = User(
                email=request.json.get('email'),
                )
            user.password_hash=request.json.get("password")
            db.session.add(user)
            db.session.commit()
        except IntegrityError as e:
            return make_response({"message": "A user with that email already exists. Try to login instead."})
        session['user_id'] = user.id
        return make_response(user.to_dict(), 201)
api.add_resource(SignUp, '/signup')

class CheckSession(Resource):
    def get(self):
        if session.get("user_id"):
            user = User.query.filter(User.id == session["user_id"]).first()
            return make_response({"user": user.to_dict()}, 200)
        else:
            return make_response({"message": "No user logged in"}, 200)
api.add_resource(CheckSession, '/check_user')

@app.before_request
def check_login():
    if not session.get("user_id") and request.method != "GET":
        return make_response({"message": "Log in to modify content"}, 401)

if __name__ == '__main__':
    app.run(port=5555, debug=True)

