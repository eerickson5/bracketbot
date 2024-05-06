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
        test_team = Team.query.filter(Team.id == 2).first()
        print(test_team.to_dict())
        print(test_team.ranking_details_by_stage([1, 2, 3]))