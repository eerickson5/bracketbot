import React, { useState } from "react";
import { Container, Button } from 'semantic-ui-react'
import DragAndDropPools from "./DragAndDropPools";

export default function PoolsDashboard({tournament, onUpdateTournament}){

    const [pools, setPools] = React.useState(getPools(tournament))

    function getPools(tournament){
        let somePools = []

        tournament.stages.forEach(pool => {
            somePools.push(pool)
        })
        return somePools
    }
    
    if (pools.length === 0) {
        return <DragAndDropPools tournament={tournament} onSubmitPools={thepools => console.log(thepools)}/>
    } else {
        return(
            <h1>Pools</h1>
        )
    }
    
}