import React, { useState } from "react";
import { Container, Button } from 'semantic-ui-react'
import DragAndDropPools from "./DragAndDropPools";
import CreatePoolsForm from "./CreatePoolsForm"

export default function PoolsDashboard({tournament, onUpdateTournament}){

    const [pools, setPools] = React.useState(getPools(tournament))
    const [currPage, setPage] = React.useState(0)

    const pages = [
        <DragAndDropPools tournament={tournament} pools={pools} onSubmitPools={teamArrays => {
            setPools(teamArrays)
            setPage(1)
        }}/>,
        <CreatePoolsForm tournament={tournament} teamArrays={pools} onGoBack={() => setPage(0)}/>
    ]

    function getPools(tournament){
        let somePools = []

        tournament.stages.forEach(pool => {
            somePools.push(pool)
        })
        return somePools
    }
    
    //TODO: only show createpoolsform if pools are teamarrays and not full objects
    // return pools.length === 0 
    return pages[currPage]
    
}