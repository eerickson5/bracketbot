import React, { useContext } from "react";
import { GridRow, GridColumn, Grid, Image } from 'semantic-ui-react'
import TournamentContext from "../TournamentContextProvider";
import GameCard from "./GameCard";

export default function BracketSchedule(){

    const [tournament, setTournament] = useContext(TournamentContext)

    const getRounds = () => {
        const games = tournament.stages.filter(stage => stage.is_bracket)[0].games

        //find the game with zero next_game
        let finalGame = {}
        const gameDict = {}
        for(let game of games){
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

    const renderColumn = (round) => {
        return  (
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
                    {round.map(game=><GameCard game={game}/>)}
            </div>
            )
    }


    return(
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
            {getRounds().map(round => renderColumn(round))}
        </div>
    )
}