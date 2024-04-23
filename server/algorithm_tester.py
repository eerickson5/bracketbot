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
        team_lists = []
        for pool_num in range(randint(2,6)):
            for _ in range(randint(5,10)):
                try:
                    team_lists[pool_num].append(fake.first_name())
                except IndexError:
                    team_lists.append([fake.name()])


        # print(f"{len(team_lists)} pools, 5 fields")

        easy_example = [["a", "b", "c", "d", "e"], ["f", "g", "h"], ["i", "j", "k", "l"], ["m", "n"], ["o", "p", "q", "r", "s"], ["t", "u"]]
        Stage.generate_pools(easy_example, 5)
        