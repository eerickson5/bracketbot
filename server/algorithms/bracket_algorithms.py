# num_games = 2^(total_rounds - current_round)
# num_teams = 2^(total_rounds - current_round + 1)
#TODO: triple check all games are scored before running this
def generate_bracket( tournament, data ):
    from datetime import time
    from models import Stage, db

    teams = tournament.teams
    num_rounds = data.get("numRounds")
    num_fields = data.get("numFields")
    times = {
        "start_time": time(data.get("startHours"), data.get("startMinutes")),
        "game_length": data.get("gameLength"), 
        "break_length": data.get("breakLength")}

    bracket = Stage(
        name= "Bracket",
        is_bracket = True,
        tournament = tournament
    )
    db.session.add(bracket)
    
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

    matchups = assign_times_and_fields(matchups, num_fields, times["start_time"], times["game_length"], times["break_length"])
    
    from algorithms.shared_algorithms import add_game_info_to_database
    for matchup in matchups:
        add_game_info_to_database(matchup)

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
                next_game = rounds[round_index + 1][upcoming_matchup_index]["game"]
                curr_round[matchup_index]["game"].next_game = next_game
                curr_round[-matchup_index - 1]["game"].next_game = next_game
                upcoming_matchup_index += 1

    for matchup in matchups:
        db.session.add(matchup["game"])

    lock_pool_scores(tournament)

    db.session.commit()

    return bracket



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

    from algorithms.shared_algorithms import add_game_timing
    start_times = add_game_timing(len(timeslots), start_time, game_length, break_length, False)
    return [ {"start_time": start_times[matchup["timeslot"]], **matchup} for matchup in matchups ]

def lock_pool_scores(tournament):
    from models import db
    pool_games = [game for stage in tournament.stages if not stage.is_bracket for game in stage.games]
    for game in pool_games:
        game.scores_locked = True
        db.session.add(game)
