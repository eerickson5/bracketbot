#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response
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
        
class CreateTeam(Resource):
    def post(self):
        # if session["user_id"]:
        print(request)
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

class CreateTournament(Resource):
    def post(self):
        # if session["user_id"]:
        print(request)
        try:
            tournament = Tournament(
                team_name=request.json.get("tournamentName"),
                image=request.json.get("image"),
                #captain_id=session["user_id"]
            )
            db.session.add(tournament)
            db.session.commit()
            return make_response(tournament.to_dict(), 201)
        except ValueError as e:
            return make_response( {"message": str(e)}, 422)
    # else:
    #     return make_response({"error": "Not logged in"}, 401)

api.add_resource(CreateTournament, '/tournament')
api.add_resource(TeamByID, '/team/<int:id>')
api.add_resource(CreateTeam, '/team')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

