#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Team, Tournament, Game, GameScore, Stage, tournament_teams
from datetime import datetime

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        team_lists = [["11", "12", "13", "14", '15'], ["34", "37"], ["61", "62", "63", "64"],]
        
        #TODO: when below is true, error....?
        schedule = Stage.generate_best_pool_schedule(team_lists, 4, False, 10)
        # schedule = Stage.generate_pool_schedule(team_lists, 4, False)

        now_time = datetime.now()
        schedule_timing = Stage.add_game_timing(len(schedule), now_time, 60, 15)
                    
        for i in range(len(schedule)):
            print (f'{schedule_timing[i].strftime("%H:%M")} == {schedule[i]}')