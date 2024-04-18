import React, { useState } from "react";
import { Container, Button } from 'semantic-ui-react'

export default function PoolsDashboard({tournament, onUpdateTournament}){

    const [pools, setPools] = React.useState(getPools(tournament))

    function getPools(tournament){
        let somePools = []

        tournament.stages.forEach(pool => {
            somePools.push(pool)
        })
        console.log(somePools)
        return somePools
    }
    
    if (pools.length === 0) {
    return (
            <Container>
                <h2>This tournament has no pools yet.</h2>
                <h4>Once you've added all your teams, generate your pools here.</h4>
                <Button primary>Create Pools</Button>
            </Container>
        )
    } else {
        return(
            <h1>Pools</h1>
        )
    }
    
}