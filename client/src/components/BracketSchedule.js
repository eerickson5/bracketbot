import React, { useContext } from "react";
import TournamentContext from "../TournamentContextProvider";
import GameCard from "./GameCard";

export default function BracketSchedule(){

    const [tournament, setTournament] = useContext(TournamentContext)

    const getRounds = () => {
        const games = tournament.stages.filter(stage => stage.is_bracket)[0].games

        //find the game with zero next_game
        let finalGame = {}
        const gameDict = {}
        let i = 0
        for(let game of games){
            game.gameIndex = i
            i++
            gameDict[game.id] = game
            if(!game.next_game_id)
                finalGame = game.id
        }

        const rounds = []

        const queue = [[finalGame, 0]];
        const visited = [];
        
        while (queue.length > 0) {
            const [currentGameId, roundIndex] = queue.shift();
            
            if (!rounds[roundIndex]) {
                rounds[roundIndex] = [];
            }
            
            rounds[roundIndex].push(gameDict[currentGameId]);
            visited.push(currentGameId);
            
            for (const prevGameId of gameDict[currentGameId].previous_games_ids) {
                if (!visited.includes(prevGameId)) {
                    queue.push([prevGameId, roundIndex + 1]);
                }
            }
        }

        return rounds.reverse()
    }

    const handleSubmitScore = ({gameScoreId, teamId, newScore, gameIndex}) => {
        fetch(`/api/game_score/${gameScoreId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                team_id: teamId,
                new_score: newScore,
            }),
        })
        .then(response => response.json())
        .then(data => {
            // const stages = tournament.stages
            // const eligibleGameScores = stages.filter(stage => stage.is_bracket)[0].games[gameIndex].game_scores
            // if(eligibleGameScores[0].id === gameScore.id)
            //     eligibleGameScores[0].own_score = gameScore.own_score
            // else if (eligibleGameScores[1].id === gameScore.id)
            //     eligibleGameScores[1].own_score = gameScore.own_score
            setTournament({
                ...tournament,
                stages: tournament.stages.map(stage => stage.id === data.stage.id ? data.stage : stage)
            })
    })
}

    const renderColumn = (round, index) => {
        return  (
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}} key={`round-${index}`}>
                    {round.map(game=><GameCard game={game} onSubmitScore={handleSubmitScore} key={game.id}/>)}
            </div>
            )
    }


    return(
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', paddingBlock: 20}}>
            {getRounds().map((round, index) => renderColumn(round, index))}
        </div>
    )
}