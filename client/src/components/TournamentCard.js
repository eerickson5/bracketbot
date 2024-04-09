import React from "react";
import { Card } from 'semantic-ui-react'

export default function TournamentCard({tournament}){
    return (
        <Card
        image={tournament.image}
        header={tournament.name}
        meta={tournament.location}
        description={`${tournament.numTeams} teams | ${tournament.numPools} Pools | ${tournament.numBrackets} Brackets`}
        />
    )
}