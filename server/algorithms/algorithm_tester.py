#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Team, Tournament, Game, GameScore, Stage, tournament_teams
from datetime import datetime
from algorithms.bracket_algorithms import lock_pool_scores

##TODO: add seed.py and algorithm_tester.py to .gitignore
if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        
        tourn = Tournament.query.filter(Tournament.id == 3)
        lock_pool_scores(tourn)
        