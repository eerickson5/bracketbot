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
        
        db.session.commit()
        print("Seeded.")