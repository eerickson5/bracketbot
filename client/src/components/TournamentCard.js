import React from "react";
import { Card } from 'semantic-ui-react'

export default function TournamentCard({tournament}){
    
    return (
        <Card
        image={tournament.image}
        header={tournament.name}
        // meta={tournament.location}
        // description={`${tournament.teams.length} teams | ${tournament.numPools ?? 0} Pools | ${tournament.numBrackets ?? 0} Brackets`}
        color="red"
        />
    )
}