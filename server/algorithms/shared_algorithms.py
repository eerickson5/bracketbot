def add_game_timing(num_timeslots, start_time, game_length, break_length, as_string=True):
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

    if as_string:
        game_start_times = [time_date.strftime('%I:%M %p') for time_date in game_start_times]
    return game_start_times

def add_game_info_to_database(matchup):
    from models import Game, db, GameScore
    matchup["game"] = Game(
        location= matchup["location"],
        start_time = matchup["start_time"],
        stage = matchup["stage"]
    )
    db.session.add(matchup["game"])
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
