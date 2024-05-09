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

def accept_pool_schedule(data):
    from models import Stage, db
            
    timeslots = data.get("timeslots")
    tournament_id = data.get("tournamentId")

    crossover_pool = Stage(
        is_bracket = False,
        tournament_id = tournament_id,
        name = f"Crossovers",
        #hold a string in the DB instead
    )
    db.session.add(crossover_pool)
    stages = [crossover_pool]

    letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I" ,"J"]
    i = 0
    for _ in range(data.get("numStages")):
        stage = Stage(
            is_bracket = False,
            tournament_id = tournament_id,
            name = f"Pool {letters[i]}",
        )
        db.session.add(stage)
        stages.append(stage)
        i += 1

    mapped_matchups = map_matchups(data.get("matchups"), timeslots, data.get("teamPools"))
    for matchup in mapped_matchups:
        matchup["stage"] = stages[matchup["pool_index"]]

    from algorithms.shared_algorithms import add_game_info_to_database
    for matchup in mapped_matchups:
        add_game_info_to_database(matchup)

    db.session.commit()
    return stages

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

