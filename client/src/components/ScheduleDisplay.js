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

export default function ScheduleDisplay({matchups, timeslots, teamArrays}){

    console.log(matchups)
    if(matchups.length === 0){
        return <div/>
    }

    const colors = ["#bdd0c4", "#9ab7d3", "#f7e1d3", "#dfccf1"]
    const matchupPools = matchupsByPool()

    //TODO: convert teamArrays to a map way earlier in the program
    function matchupsByPool() {
        let teamPools = {}
        const matchupPools = {}
        for(let i = 0; i < teamArrays.length; i ++){
            for(const team of teamArrays[i]){
                teamPools[team] = i
            }
        }
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
                {matchups[0].map((matchup, index) => <TableHeaderCell>Field {index + 1}</TableHeaderCell>)}
            </TableRow>
          </TableHeader>
      
          <TableBody>
            {timeslots.map((time, index) => {
                return (
                    <TableRow>
                        <TableCell>
                            <h4>{time}</h4>
                        </TableCell>
                        {matchups[index].map(matchup => <TableCell style={{backgroundColor: colors[matchupPools[matchup]]}}>{matchup[0]} vs {matchup[1]}</TableCell>)}
                    </TableRow>)
            })}
          </TableBody>
      
        </Table>
      )
}