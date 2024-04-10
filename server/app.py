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

api.add_resource(TeamByID, '/team/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

