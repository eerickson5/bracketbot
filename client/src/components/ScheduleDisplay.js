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

export default function ScheduleDisplay({matchups, timeslots, teamPools}){
    if(matchups.length === 0){
        return <div/>
    }

    const colors = ["#DDE0E4", "#D57A7C", "#68908F", "#D7BD82", "#9FB58D", "#D59C7F", "#4C839A", "#CD9D62", "#6F8292", "#8C98A3"]
    const matchupPools = matchupsByPool()

    //TODO: convert teamArrays to a map way earlier in the program
    function matchupsByPool() {
        const matchupPools = {}
        for(const matchupRow of matchups){
            for(const matchup of matchupRow){
                if(teamPools[matchup[0]] !== teamPools[matchup[1]]){
                    matchupPools[matchup] = 0
                } else {
                    matchupPools[matchup] = teamPools[matchup[0]] + 1
                }
            }
        }
        return matchupPools
    }

    return(
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
                        {matchups[index].map(matchup => <TableCell key={matchup} style={{backgroundColor: colors[matchupPools[matchup]]}}>{matchup[0]} vs {matchup[1]}</TableCell>)}
                    </TableRow>)
            })}
          </TableBody>
      
        </Table>
      )
}