#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Team, Tournament, Game, GameScore, Stage, tournament_teams
from datetime import datetime
from algorithms.pool_algorithms import rank_teams, generate_bracket

##TODO: add seed.py and algorithm_tester.py to .gitignore
if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        def print_schedule(matchups):
            for matchup in matchups:
                print(matchup['matchup'], "Round", matchup['round'], "Timeslot", matchup['timeslot'], matchup['location'])

        from datetime import time
        start_time = time(7, 0)

        teams = Team.query.all()
        tourn = Tournament.query.first()
        # print ([team["team"].id for team in rank_teams(teams, [1, 2, 3])])
        bracket = (generate_bracket(teams, 3, 2, tourn, start_time, 60, 15))
        
        for game in bracket:
            print(game)

        