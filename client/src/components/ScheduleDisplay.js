import React from "react";
import {
    TableRow,
    TableHeaderCell,
    TableHeader,
    TableFooter,
    TableCell,
    TableBody,
    MenuItem,
    Icon,
    Label,
    Menu,
    Table,
  } from 'semantic-ui-react'
import TournamentContext from "../TournamentContextProvider";

export default function ScheduleDisplay({matchups, timeslots, teamPools, teamsById}){
    const [tournament, ] = React.useContext(TournamentContext)
    console.log(tournament)

    const colors = ["#DDE0E4", "#D57A7C", "#85C7F2", "#68908F", "#D7BD82", "#9FB58D", "#D59C7F", "#4C839A", "#CD9D62", "#6F8292"]
    const matchupPools = matchupsByPool()

    function matchupsByPool() {
        const matchupPools = {}
        for(const matchupRow of matchups){
            for(const matchup of matchupRow){
                if(teamPools[matchup[0]] !== teamPools[matchup[1]]){
                    matchupPools[matchup] = 0
                } else {
                    matchupPools[matchup] = teamPools[matchup[0]]
                }
            }
        }
        return matchupPools
    }

    if (timeslots.length === 0){
        return null
    }
    return(
        <div style={{marginBlock: 15, display: "flex", flexDirection: 'column', alignItems: 'center', flexWrap: 'wrap',}}>
            <h3>Temporary Schedule ...</h3>
            <h5 style={{marginBlock: 5}}>colored by pool / crossover</h5>
            <Table celled collapsing color='red'>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell />
                        {matchups[0].map((matchup, index) => <TableHeaderCell key={index}>Field {index + 1}</TableHeaderCell>)}
                    </TableRow>
                </TableHeader>
            
                <TableBody>
                    {timeslots.map((time, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    <h4>{time}</h4>
                                </TableCell>
                                {matchups[index].map(matchup => <TableCell key={matchup} style={{backgroundColor: colors[matchupPools[matchup]]}}>{teamsById[matchup[0]].team_name} vs {teamsById[matchup[1]].team_name}</TableCell>)}
                            </TableRow>)
                    })}
                </TableBody>
        
            </Table>
        </div>
        
      )
}