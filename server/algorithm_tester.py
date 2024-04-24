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
        #TODO: test with a odd number of teams
        team_lists = [["11", "12", "13", "14", '15'], ["34", "37"], ["61", "62", "63", "64"],]
        
        # schedule = Stage.generate_crossover_matchups(team_lists)

        schedule = Stage.generate_best_pool_schedule(team_lists, 4, False, 10)
        # schedule = Stage.generate_pool_schedule(team_lists, 4, False)
                    
        for row in schedule:
            print(row)