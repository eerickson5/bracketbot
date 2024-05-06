from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
# from sqlalchemy import MetaData
from config import db
from sqlalchemy.orm import backref



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
    image = db.Column(db.String)
    # captain_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    game_scores = db.relationship("GameScore", back_populates = "team")
    games = association_proxy('game_scores', 'game', creator=lambda game_obj: GameScore(game=game_obj))
    tournaments = db.relationship('Tournament', secondary=tournament_teams, back_populates="teams")

    serialize_only = ('id', 'team_name', 'image',)

    #dont forget to send in crossovers if applicable
    def ranking_details_by_stage(self, stage_ids):
        team_rank = {
        "record": 0,
        "point_diff": 0,
        "num_games": len(self.games),
        }

        for game in self.games:
            if game.stage_id in stage_ids:
                score = game.score
                if score[0]["team_id"] == self.id:
                    team_rank["point_diff"] += score[0]['score']
                    team_rank["point_diff"] -= score[1]['score']
                else:
                    team_rank["point_diff"] += score[1]['score']
                    team_rank["point_diff"] -= score[0]['score']

                winner_id = game.winner.id
                if winner_id == self.id:
                    team_rank["record"] += 3
                elif winner_id == None:
                    team_rank["record"] += 1

        return team_rank

    def weighted_ranking_details_by_stage(self, stage_ids):
        team_rank = self.ranking_details_by_stage(stage_ids)
        team_rank["record"] = team_rank["record"] / team_rank["num_games"]
        team_rank["point_diff"] = team_rank["point_diff"] / team_rank["num_games"]
        return team_rank

class GameScore(db.Model, SerializerMixin):
    __table_name__ = "gamescores"
    id = db.Column(db.Integer, primary_key=True)
    own_score = db.Column(db.Integer)
    opponent_score = db.Column(db.Integer)

    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    team = db.relationship("Team", back_populates = "game_scores")

    game_id = db.Column(db.Integer, db.ForeignKey('game.id'))
    game = db.relationship("Game", back_populates = "game_scores")

    serialize_only = ('id', 'team_id', 'own_score', 'opponent_score', 'game_id')

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

    #references for bracket as binary tree
    next_game_id = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=True)
    next_game = db.relationship('Game', remote_side=[id], foreign_keys=[next_game_id], backref=backref('previous_games', lazy=True))
    
    left_previous_game_id = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=True)
    left_previous_game = db.relationship('Game', foreign_keys=[left_previous_game_id], backref=backref('left_next_game', remote_side=[id], uselist=False))
    
    right_previous_game_id = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=True)
    right_previous_game = db.relationship('Game', foreign_keys=[right_previous_game_id], backref=backref('right_next_game', remote_side=[id], uselist=False))

    serialize_only = ('id', 'location', 'start_time', 
                      'teams', 
                      'stage.name',
                      'game_scores.own_score', 'game_scores.team', 'game_scores.id')

    @property
    def score(self):
        return[{'team_id': gs.team_id, 'score': gs.own_score} for gs in self.game_scores]
    
    @property
    def winner(self):
        try:
            if self.game_scores[0].own_score > self.game_scores[1].own_score:
                return self.game_scores[0].team
            elif self.game_scores[0].own_score < self.game_scores[1].own_score:
                return self.game_scores[1].team
            else:
                return Team()
        except IndexError:
            return None



class Stage(db.Model, SerializerMixin):
    __table_name__ = "stages"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    start_time = db.Column(db.DateTime)
    # end_time = db.Column(db.DateTime)
    minutes_per_game = db.Column(db.Integer)
    minutes_per_break = db.Column(db.Integer)
    is_bracket = db.Column(db.Boolean)
    #is_crossover = db.Column(db.Boolean)

    tournament_id = db.Column(db.Integer, db.ForeignKey('tournament.id'))
    tournament = db.relationship("Tournament", back_populates = "stages")
    games = db.relationship("Game", back_populates = "stage")

    serialize_only = ('games', 'name')  



class Tournament(db.Model, SerializerMixin):
    __table_name__ = "tournaments"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    num_fields = db.Column(db.Integer)
    image = db.Column(db.String)

    stages = db.relationship("Stage", back_populates = "tournament")
    games = association_proxy("stages", 'games', creator=lambda game_obj: Stage(game=game_obj))
    teams = db.relationship("Team", secondary=tournament_teams, back_populates = 'tournaments')

    serialize_only = ('id', 'name', 'image', 'num_fields', 'teams', 'stages')

    def rationalize_teams(self, given_teams):
        recurring_teams = []
        old_teams_set = set([team.id for team in self.teams])

        #add teams that didn't exist yet
        for team in given_teams:
            if not team.get("id"):
                new_team = Team(
                    team_name=team["team_name"],
                    image=team["image"],
                )
                db.session.add(new_team)
                self.teams.append(new_team)
            else:
                recurring_teams.append(team["id"])
        #remove teams that used to be a part of the tournament but are no longer
        team_ids_to_delete = old_teams_set.difference(set(recurring_teams))
        for team_id in team_ids_to_delete:
            team_to_delete = Team.query.filter(Team.id == team_id).first()
            if len(team_to_delete.tournaments) == 1:
                db.session.delete(team_to_delete)
        
        db.session.commit()

    @property
    def pools(self):
        return [a for a in self.stages if not a.is_bracket]
    
    @property
    def brackets(self):
        return [a for a in self.stages if a.is_bracket]

    # on delete also delete stages, games, gamescores, and tournament-teams