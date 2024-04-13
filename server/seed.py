#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Team, Tournament, Game, GameScore, Stage, tournament_teams

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Deleting all records...")
        Team.query.delete()
        Game.query.delete()
        GameScore.query.delete()
        Tournament.query.delete()
        Stage.query.delete()
        db.session.query(tournament_teams).delete()

        # print("Starting seed...")

        # # 2 teams
        # magma = Team(team_name = "Magma")
        # ozone = Team(team_name = "Ozone")
        # db.session.add(ozone)
        # db.session.add(magma)

        # #1 tournament
        # tourney = Tournament(
        #     name = "Round Robin",
        #     num_fields = 1
        # )
        # db.session.add(tourney)
        # #1 stage
        # pool = Stage(
        #     name = "Pool",
        #     minutes_per_game = 90,
        #     is_bracket = False,
        #     tournament = tourney
        # )
        # db.session.add(pool)
        # # 1 game
        # matchup = Game(
        #     location = "SAC",
        #     stage = pool
        # )
        # db.session.add(matchup)
        # # 2 game_scores
        # magma_score = GameScore(
        #     own_score = 5,
        #     opponent_score = 12,
        #     team = magma,
        #     game = matchup
        # )
        # ozone_score = GameScore(
        #     own_score = 12,
        #     opponent_score = 5,
        #     team = ozone,
        #     game = matchup
        # )
        # db.session.add(magma_score)
        # db.session.add(ozone_score)
        db.session.commit()
        print("Seeded.")