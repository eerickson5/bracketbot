import React, { useState } from "react";
import { Container, Button } from 'semantic-ui-react'
import DragAndDropPools from "./DragAndDropPools";
import CreatePoolsForm from "./CreatePoolsForm"

export default function PoolsDashboard({tournament, onUpdateTournament}){

    const [pools, setPools] = React.useState(getPools(tournament))

    function getPools(tournament){
        let somePools = []

        tournament.stages.forEach(pool => {
            somePools.push(pool)
        })
        return somePools
    }
    
    //TODO: only show createpoolsform if pools are teamarrays and not full objects
    return pools.length === 0 
    ? <DragAndDropPools tournament={tournament} onSubmitPools={teamArrays => setPools(teamArrays)}/>
    : <CreatePoolsForm tournament={tournament} teamArrays={pools}/>
    
}