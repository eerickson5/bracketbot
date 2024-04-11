from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
# from sqlalchemy import MetaData
from config import db



tournament_teams = db.Table(
    "tournament_teams",
    # metadata,
    db.Column('tournament_id', db.Integer, db.ForeignKey("tournament.id"), primary_key=True),
    db.Column('team_id', db.Integer, db.ForeignKey("team.id"), primary_key=True)
)

class Team(db.Model, SerializerMixin):
    __table_name__ = "teams"
    id = db.Column(db.Integer, primary_key = True)
    team_name = db.Column(db.String)
    # captain_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    game_scores = db.relationship("GameScore", back_populates = "team")
    games = association_proxy('game_scores', 'game', creator=lambda game_obj: GameScore(game=game_obj))
    tournaments = db.relationship('Tournament', secondary=tournament_teams, back_populates="teams")

    # serialize_only = ('id', 'team_name', 'game_scores')

class GameScore(db.Model, SerializerMixin):
    __table_name__ = "gamescores"
    id = db.Column(db.Integer, primary_key=True)
    own_score = db.Column(db.Integer)
    opponent_score = db.Column(db.Integer)

    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    team = db.relationship("Team", back_populates = "game_scores")

    game_id = db.Column(db.Integer, db.ForeignKey('game.id'))
    game = db.relationship("Game", back_populates = "game_scores")

class Game(db.Model, SerializerMixin):
    __table_name__ = "games"
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String)
    start_time = db.Column(db.DateTime)
    # parent_id = db.Column(db.Integer, db.ForeignKey('games.id'))

    stage_id = db.Column(db.Integer, db.ForeignKey('stage.id'))
    stage = db.relationship("Stage", back_populates = "games")

    game_scores = db.relationship("GameScore", back_populates = "game")
    teams = association_proxy('game_scores', 'team', creator=lambda team_obj: GameScore(team=team_obj))
    tournaments = association_proxy('stages', 'tournament', creator=lambda tourney_obj: Stage(tournament=tourney_obj))

class Stage(db.Model, SerializerMixin):
    __table_name__ = "stages"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    start_time = db.Column(db.DateTime)
    # end_time = db.Column(db.DateTime)
    minutes_per_game = db.Column(db.Integer)
    minutes_per_break = db.Column(db.Integer)
    is_bracket = db.Column(db.Boolean)

    tournament_id = db.Column(db.Integer, db.ForeignKey('tournament.id'))
    tournament = db.relationship("Tournament", back_populates = "stages")

    games = db.relationship("Game", back_populates = "stage")


class Tournament(db.Model, SerializerMixin):
    __table_name__ = "tournaments"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    num_fields = db.Column(db.Integer)

    stages = db.relationship("Stage", back_populates = "tournament")
    games = association_proxy("stages", 'games', creator=lambda game_obj: Stage(game=game_obj))
    teams = db.relationship("Team", secondary=tournament_teams, back_populates = 'tournaments')