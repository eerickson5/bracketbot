def generate_matchups(teams):
    matchups = []
    for i in range(len(teams)):
        for j in range(i + 1, len(teams)):
            matchups.append((teams[i], teams[j]))
    return matchups


def convert_matchup_list_to_dict(matchup_list, default_value):
    matchup_dict = {}
    for matchup in matchup_list:
        matchup_dict[matchup] = default_value
    return matchup_dict


def team_list_to_timeslots(team_lists):
    team_dict = {}
    for team_list in team_lists:
        for team in team_list:
            team_dict[team] = []
    return team_dict


def remove_proper_index(list, index):
    if len(list) == 1 and index == 0:
        return []
    elif index == len(list) - 1:
        return list[:-1]
    else:
        return list[:index] + list[index+1:]
    
def generate_crossover_matchups(team_lists):
    from random import shuffle, randint
    matchups = []
    team_pools = {}
    available_teams = []
    for i in range(len(team_lists)):
        for team in team_lists[i]:
            team_pools[team] = i

    #if there are an odd number of teams, the largest pool removes a team from crossover play
    if len(available_teams) % 2 != 0:
        largest_pool = []
        for i in range(len(team_lists)):
            if len(team_lists[i]) > len(largest_pool):
                largest_pool = team_lists[i]
        random_index = randint(0,len(largest_pool) - 1)
        team_pools.pop(largest_pool[random_index])

    available_teams = [team for team in list(team_pools.keys())]
    shuffle(available_teams)
    while len(available_teams) > 1:
        i = 1
        while(i < len(available_teams) - 1 and team_pools.get(available_teams[0]) == team_pools.get(available_teams[i])):
            i += 1
        matchups.append((available_teams[0], available_teams[i]))
        available_teams = remove_proper_index(available_teams, 0)
        available_teams = remove_proper_index(available_teams, i - 1)
    return matchups


def generate_pool_schedule(team_lists, num_fields, crossovers_allowed):
    from random import shuffle
    matchup_list_by_pools = [generate_matchups(team_list) for team_list in team_lists]
    matchup_list = []
    for matchups in matchup_list_by_pools:
        matchup_list.extend(matchups)
    if crossovers_allowed:
        matchup_list.extend(generate_crossover_matchups(team_lists))
    shuffle(matchup_list)
    team_timeslots = team_list_to_timeslots(team_lists)
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
        matchup_list = remove_proper_index(matchup_list, i)
        if len(timeslots[current_timeslot]) == num_fields:
            current_timeslot += 1
    return timeslots

#TODO: sorted(least timeslots, pools mostly in the same spot)
def generate_best_pool_schedule(team_lists, num_fields, crossovers_allowed, times_to_run):
    generated_schedules = []
    for _ in range(times_to_run):
        generated_schedules.append(generate_pool_schedule(team_lists, num_fields, crossovers_allowed))
        

    shortest_schedule = None
    shortest_schedule_length = 50
    for schedule in generated_schedules:
        if len(schedule) < shortest_schedule_length:
            shortest_schedule = schedule
            shortest_schedule_length = len(schedule)
    
    return shortest_schedule


def add_game_timing(num_timeslots, start_time, game_length, break_length):
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
    

def map_matchups(matchups, timeslots, team_pools):
    from datetime import datetime
    game_maps = []
    for timeslot_index in range(len(matchups)):
        for field_index in range(len(matchups[timeslot_index])):
            matchup = matchups[timeslot_index][field_index]
            game_maps.append({
                "matchup": matchup,
                "start_time": datetime.strptime(timeslots[timeslot_index], '%I:%M %p'),
                "location": f"Field {field_index + 1}",
                "pool_index": team_pools[matchup[0]] if team_pools[matchup[0]] == team_pools[matchup[1]] else 0
            })
    return game_maps

# num_games = 2^(total_rounds - current_round)
# num_teams = 2^(total_rounds - current_round + 1)
#TODO: triple check all games are scored before running this
def generate_bracket(teams, num_rounds, num_fields, tournament, start_time, game_length, break_length):
    
    from models import Stage, db
    bracket = Stage(
        name= "Bracket",
        is_bracket = True,
        tournament = tournament
    )
    db.session.add(bracket)
    db.session.commit()
    
    pools = [stage.id for stage in tournament.stages if not stage.is_bracket]
    ranked_teams = rank_teams(teams, pools)[0 : 2**num_rounds]

    matchups = []
    for i in range(len(ranked_teams) // 2):
        matchups.append({
            "matchup": [ranked_teams[i]["team"].id, ranked_teams[(- i - 1)]["team"].id],
            "round": 1,
            "stage": bracket
        })
        
    for curr_round in range(2, num_rounds + 1):
        for i in range(2**(num_rounds - curr_round)):
            matchups.append({
                "matchup": [0,0],
                "round": curr_round,
                "stage": bracket
            })  

    matchups = assign_times_and_fields(matchups, num_fields, start_time, game_length, break_length)
    add_game_info_to_database(matchups)

    rounds = [[]]
    for matchup in matchups:
        try:
            rounds[matchup["round"]].append(matchup)
        except IndexError:
            rounds.append([matchup])

    for round_index in range(1, len(rounds) - 1):
        curr_round = rounds[round_index]
        if len(curr_round) > 1:
            upcoming_matchup_index = 0
            for matchup_index in range(len(curr_round) // 2):
                curr_round[matchup_index]["game"].next_game = rounds[round_index + 1][upcoming_matchup_index]["game"]
                curr_round[-matchup_index - 1]["game"].next_game = rounds[round_index + 1][upcoming_matchup_index]["game"]
                upcoming_matchup_index += 1

    for matchup in matchups:
        db.session.add(matchup["game"])

    db.session.commit()
    return [{
        "game_scores": [] if matchup["matchup"] == [0,0] else [matchup["game_score_1"], matchup["game_score_2"]], 
        "game": matchup["game"]
        } for matchup in matchups]

#TODO: use this when accepting pool schedule for DRY code
def add_game_info_to_database(matchups):
    from models import Game, GameScore, db

    for matchup in matchups:
        matchup["game"] = Game(
            location= matchup["location"],
            start_time = matchup["start_time"],
            stage = matchup["stage"]
        )
        db.session.add(matchup["game"])

    for matchup in matchups:
        if matchup["matchup"][0] != 0:
            matchup["game_score_1"] = GameScore(
                    team_id=matchup["matchup"][0],
                    game = matchup["game"]
                    )
            matchup["game_score_2"] = GameScore(
                team_id=matchup["matchup"][1],
                game = matchup["game"]
                )
            db.session.add(matchup["game_score_1"])
            db.session.add(matchup["game_score_2"])

def rank_teams(teams, stage_ids):
    return sorted(
        [{"team": team, **team.weighted_ranking_details_by_stage(stage_ids)} for team in teams],
        key=lambda x: (x["record"], x["point_diff"], x["num_games"]),
        reverse=True
    )

def assign_times_and_fields(matchups, num_fields, start_time, game_length, break_length):
    timeslots = [1]
    curr_timeslot = 0
    curr_field = 0
    previous_round = 1
    for matchup in matchups:
        if timeslots[curr_timeslot] <= num_fields and matchup["round"] == previous_round:
            curr_field += 1
            timeslots[curr_timeslot] += 1
            matchup["location"] = f"Field {curr_field}"
            matchup["timeslot"] = curr_timeslot
            previous_round = matchup["round"]
        else:
            timeslots.append(1)
            curr_timeslot += 1
            curr_field = 1
            matchup["timeslot"] = curr_timeslot
            matchup["location"] = f"Field {curr_field}"
            previous_round = matchup["round"]

    
    start_times = add_game_timing(len(timeslots), start_time, game_length, break_length)
    return [ {"start_time": start_times[matchup["timeslot"]], **matchup} for matchup in matchups ]