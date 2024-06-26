import React, {useContext } from "react";
import GameCard from "./GameCard";
import {
    TableRow,
    TableHeaderCell,
    TableHeader,
    TableCell,
    TableBody,
    Table,
  } from 'semantic-ui-react'
import TournamentContext from "../TournamentContextProvider";
//TODO: save last schedule so user can go back in case next generation sucks
//TODO: it runs off the screen if 5 or more fields

export default function ScheduleDisplay({pools, scoresEditable=false, title, subtitle}){
    const poolsToColors = {"Crossovers": "#000000", "Pool A": "#D57A7C", "Pool B": "#85C7F2", "Pool C": "#68908F", "Pool D": "#D7BD82", "Pool E": "#9FB58D", "Pool F": "#D59C7F", "Pool G": "#4C839A", "Pool H": "#CD9D62", "Bracket": "#6F8292"}
    //Temporary solution for ease of coding above

    const [tournament, setTournament] = useContext(TournamentContext)
    
    function timeslotsToGames(){
        let timeslots = []
        for(const pool of pools){
            let i = 0
            for(const game of pool.games){
                game["poolColor"] = poolsToColors[pool.name]
                if(scoresEditable){
                    game["gameIndex"] = i
                    game["poolIndex"] = pool.poolIndex
                    i ++
                }
                if(game.readable_time in timeslots)
                    timeslots[game.readable_time].push(game)
                else
                    timeslots[game.readable_time] = [game]
            }
        }
        for(let key in timeslots){
            timeslots[key].sort((a, b) => parseInt(a.location.match(/\d+/)[0]) - parseInt(b.location.match(/\d+/)[0]))
        }
        return timeslots
    }

    const timeStringToMinutes = (timeString) => {
        const [hours, minutes] = timeString.split(':')
                                    .map(str => str.length > 2 ? Number(str.slice(0,2)) : Number(str));
        if (timeString.includes("p") && hours !== 12)
            return (hours + 12) * 60 + minutes;
        else 
            return hours * 60 + minutes;
    };

    const handleSubmitScore = scoresEditable ? ({gameScoreId, teamId, newScore, gameIndex, poolIndex}) => {
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
        .then(data=> {
            setTournament({
                ...tournament,
                stages: tournament.stages.map(stage => stage.id === data.stage.id ? data.stage : stage)
            })
        })
        .catch(error => {
            console.error('Error updating score:', error);
        });
    } : null

    const timeslots = timeslotsToGames()
    if(!pools.length){
        return null
    }
    return(
        <div style={{paddingBlock: 15, display: "flex", flexDirection: 'column', alignItems: 'center', flexWrap: 'wrap',}}>
            <h3>{title}</h3>
            <h5 style={{marginBlock: 5}}>{subtitle}</h5>
            <Table collapsing color='red'>
                
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell />
                        {Object.values(timeslots)
                        .sort((a,b) => b.length - a.length)
                        [0]
                        .map((_, index) => <TableHeaderCell key={index}>Field {index + 1}</TableHeaderCell>)}
                    </TableRow>
                </TableHeader>
           
                <TableBody>
                    {Object.keys(timeslots)
                    .sort((a,b) => timeStringToMinutes(a) - timeStringToMinutes(b))
                    .map((key, index) => {
                        const games = timeslots[key]
                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    <h4>{games[0].readable_time}</h4>
                                </TableCell>
                                {games.map(
                                    game => <TableCell key={game.id}>
                                        <GameCard game={game} onSubmitScore={handleSubmitScore}/>
                                    </TableCell>
                                )}
                            </TableRow>)
                    })
                    }
                </TableBody> 
        
            </Table>
        </div>
        
      )
}