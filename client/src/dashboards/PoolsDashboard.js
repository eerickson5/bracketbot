import React, { useContext, useState } from "react";
import { Container, Button } from 'semantic-ui-react'
import DragAndDropPools from "../components/DragAndDropPools";
import CreatePoolsForm from "../components/CreatePoolsForm"
import TournamentContext from "../TournamentContextProvider";

export default function PoolsDashboard(){

    const [tournament, setTournament] = useContext(TournamentContext)
    const [pools, setPools] = React.useState(getPools(tournament))
    const [currPage, setPage] = React.useState(0)

    const pages = [
        <DragAndDropPools pools={pools} onSubmitPools={teamArrays => {
            setPools(teamArrays)
            setPage(1)
        }}/>,
        //TODO: remove tournament prop drill from this one too
        <CreatePoolsForm tournament={tournament} teamArrays={pools} onGoBack={() => setPage(0)}/>
    ]

    function getPools(tournament){
        let somePools = []
        //TODO: return tournament.stages ?? if ! is_brackets

        tournament.stages.forEach(pool => {
            somePools.push(pool)
            console.log("pool: ", pool)
        })
        return somePools
    }
    
    //TODO: only show createpoolsform if pools are teamarrays and not full objects
    //DONT RENDER if pools already exist
    // return pools.length === 0 
    return pages[currPage]
    
}