import React, {useState} from "react";
import GameCard from "./GameCard";
import {
    TableRow,
    TableHeaderCell,
    TableHeader,
    TableCell,
    TableBody,
    Table,
  } from 'semantic-ui-react'

export default function ScheduleDisplay({pools, scoresEditable=false}){
    const poolsToColors = {"Crossovers": "#DDE0E4", "Pool A": "#D57A7C", "Pool B": "#85C7F2", "Pool C": "#68908F", "Pool D": "#D7BD82", "Pool E": "#9FB58D", "Pool F": "#D59C7F", "Pool G": "#4C839A", "Pool H": "#CD9D62", "Pool I": "#6F8292"}
    //Temporary solution for ease of coding above

    //TODO: make sure fields are in order
    //TODO: make sure times are in order

    function timeslotsToGames(){
        let timeslots = []
        for(const pool of pools){
            for(const game of pool.games){
                game["poolColor"] = poolsToColors[pool.name]
                game["readableTime"] = game.start_time.split(' ')[1]
                if(game.readableTime in timeslots)
                    timeslots[game.readableTime].push(game)
                else
                    timeslots[game.readableTime] = [game]
            }
        }
        for(let key in timeslots){
            timeslots[key].sort((a, b) => parseInt(a.location.match(/\d+/)[0]) - parseInt(b.location.match(/\d+/)[0]))
        }
        //TODO: make sure its always in order!!
        return timeslots
    }

    const timeStringToMinutes = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const timeslots = timeslotsToGames()

    return(
        <div style={{marginBlock: 15, display: "flex", flexDirection: 'column', alignItems: 'center', flexWrap: 'wrap',}}>
            <h3>Pool Play Schedule</h3>
            <h5 style={{marginBlock: 5}}>colored by pool / crossover</h5>
            <Table celled collapsing color='red'>

                
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell />
                        {Object.values(timeslots)[0].map((_, index) => <TableHeaderCell key={index}>Field {index + 1}</TableHeaderCell>)}
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
                                    <h4>{games[0].readableTime}</h4>
                                </TableCell>
                                {games.map(
                                    game => <TableCell key={game.id} style={{backgroundColor: game.poolColor}}>
                                        <GameCard game={game} scoreEditable={scoresEditable}/>
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