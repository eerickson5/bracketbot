from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

class Team(db.Model, SerializerMixin):
    __table_name__ = "teams"
    id = db.Column(db.Integer, primary_key = True)
    team_name = db.Column(db.String)
    # captain_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class GameScore(db.Model, SerializerMixin):
    __table_name__ = "gamescores"
    id = db.Column(db.Integer, primary_key=True)
    own_score = db.Column(db.Integer)
    opponent_score = db.Column(db.Integer)
    # team_id = db.Column(db.Integer, db.ForeignKey('teams.id'))
    # game_id = db.Column(db.Integer, db.ForeignKey('games.id'))

class Game(db.Model, SerializerMixin):
    __table_name__ = "games"
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String)
    start_time = db.Column(db.DateTime)
    # stage_id = db.Column(db.Integer, db.ForeignKey('stages.id'))
    # parent_id = db.Column(db.Integer, db.ForeignKey('games.id'))

class Stage(db.Model, SerializerMixin):
    __table_name__ = "stages"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    start_time = db.Column(db.DateTime)
    # end_time = db.Column(db.DateTime)
    minutes_per_game = db.Column(db.Integer)
    minutes_per_break = db.Column(db.Integer)
    is_bracket = db.Column(db.Boolean)
    # tournament_id = db.Column(db.Integer, db.ForeignKey('tournaments.id'))


class Tournament(db.Model, SerializerMixin):
    __table_name__ = "tournaments"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    num_fields = db.Column(db.Integer)
