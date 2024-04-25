from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
# from sqlalchemy import MetaData
from config import db
import functools



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

    serialize_only = ('id', 'team_name', 'image', 'game_scores')

class GameScore(db.Model, SerializerMixin):
    __table_name__ = "gamescores"
    id = db.Column(db.Integer, primary_key=True)
    own_score = db.Column(db.Integer)
    opponent_score = db.Column(db.Integer)

    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    team = db.relationship("Team", back_populates = "game_scores")

    game_id = db.Column(db.Integer, db.ForeignKey('game.id'))
    game = db.relationship("Game", back_populates = "game_scores")

    serialize_only = ('team_id', 'own_score', 'opponent_score')

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

    serialize_only = ('teams', 'location', 'game_scores', 'start_time')

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

    #Calculating brackets notes:
    #get length of games and rests and number of games
    #make pools
    #check if there are enough fields
    #adjust
    # this tournament will last x hours y minutes with b brackets. is that ok?
    #when should it start?
    #it ends at c. is that ok?
    #submit THEN assign teams

    @classmethod
    def generate_matchups(cls, teams):
        matchups = []
        for i in range(len(teams)):
            for j in range(i + 1, len(teams)):
                matchups.append((teams[i], teams[j]))
        return matchups
    
    @classmethod
    def convert_matchup_list_to_dict(cls, matchup_list, default_value):
        matchup_dict = {}
        for matchup in matchup_list:
            matchup_dict[matchup] = default_value
        return matchup_dict

    @classmethod
    def team_list_to_timeslots(cls, team_lists):
        team_dict = {}
        for team_list in team_lists:
            for team in team_list:
                team_dict[team] = []
        return team_dict
    
    @classmethod
    def remove_proper_index(cls, list, index):
        if len(list) == 1 and index == 0:
            return []
        elif index == len(list) - 1:
            return list[:-1]
        else:
            return list[:index] + list[index+1:]
        
    @classmethod
    def generate_crossover_matchups(cls, team_lists):
        from random import shuffle, randint
        matchups = []
        team_pools = {}
        available_teams = []
        for i in range(len(team_lists)):
            for team in team_lists[i]:
                team_pools[team] = i
                available_teams.append(team)

        shuffle(available_teams)

        #if there are an odd number of teams, the largest pool removes a team from crossover play
        if len(available_teams) % 2 != 0:
            largest_pool = []
            for i in range(len(team_lists)):
                if len(team_lists[i]) > len(largest_pool):
                    largest_pool = team_lists[i]
            random_index = randint(0,len(largest_pool) - 1)
            team_pools.pop(largest_pool[random_index])
            #technically I should remove that team from available_teams too but it doesn't seem to matter

        while len(available_teams) > 1:
            i = 1
            while(i < len(available_teams) - 1 and team_pools.get(available_teams[0]) == team_pools.get(available_teams[i])):
                i += 1
            matchups.append((available_teams[0], available_teams[i]))
            available_teams = cls.remove_proper_index(available_teams, 0)
            available_teams = cls.remove_proper_index(available_teams, i - 1)
            
        return matchups
    

    ## i currently prefer this way because it won't be run infinite times if the random search takes too long
    @classmethod
    def generate_pool_schedule(cls, team_lists, num_fields, crossovers_allowed):
        from random import shuffle
        matchup_list_by_pools = [cls.generate_matchups(team_list) for team_list in team_lists]
        matchup_list = []
        for matchups in matchup_list_by_pools:
            matchup_list.extend(matchups)
        if crossovers_allowed:
            matchup_list.extend(cls.generate_crossover_matchups(team_lists))
        shuffle(matchup_list)
        team_timeslots = cls.team_list_to_timeslots(team_lists)
        timeslots = []
        current_timeslot = 0

        def matchup_is_compliant(matchup, _team_timeslots, _current_timeslot):
            return (_current_timeslot not in _team_timeslots[matchup[0]]
            and _current_timeslot not in _team_timeslots[matchup[1]])
            
        while len(matchup_list) > 0:
            i = 0
            while not matchup_is_compliant(matchup_list[i], team_timeslots, current_timeslot):
                if i + 1 < len(matchup_list):
                    i += 1
                else:
                    current_timeslot += 1
                    i = 0
            current_matchup = matchup_list[i]
            try:
                timeslots[current_timeslot].append(current_matchup)
            except IndexError:
                timeslots.append([current_matchup])
            team_timeslots[current_matchup[0]].append(current_timeslot)
            team_timeslots[current_matchup[1]].append(current_timeslot)
            matchup_list = cls.remove_proper_index(matchup_list, i)
            if len(timeslots[current_timeslot]) == num_fields:
                current_timeslot += 1
        return timeslots

    @classmethod
    def generate_best_pool_schedule(cls, team_lists, num_fields, crossovers_allowed, times_to_run):
        generated_schedules = []
        for _ in range(times_to_run):
            generated_schedules.append(cls.generate_pool_schedule(team_lists, num_fields, crossovers_allowed))
            

        shortest_schedule = None
        shortest_schedule_length = 50
        for schedule in generated_schedules:
            if len(schedule) < shortest_schedule_length:
                shortest_schedule = schedule
                shortest_schedule_length = len(schedule)
        
        return shortest_schedule
    
    @classmethod
    def add_game_timing(cls, num_timeslots, start_time, game_length, break_length):
        from datetime import timedelta, datetime
        game_start_times = []
        last_game_end = None
        temporary_start_time_date = datetime.combine(datetime.today(), start_time)

        for _ in range(num_timeslots):
            if len(game_start_times) == 0:
                game_start_times.append(temporary_start_time_date)
                last_game_end = temporary_start_time_date + timedelta(minutes=game_length)
            else:
                next_start_time = last_game_end + timedelta(minutes=break_length)
                game_start_times.append(next_start_time)
                last_game_end = next_start_time + timedelta(minutes=game_length)

        game_start_times = [time_date.strftime('%I:%M %p') for time_date in game_start_times]
        return game_start_times
            



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