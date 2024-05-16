import React from "react";
import { Card } from 'semantic-ui-react'
import DynamicImage from "./DynamicImage";

export default function TournamentCard({tournament, handleOnClick}){
    return (
        <Card
        image={<DynamicImage 
                image={tournament.image} 
                isFullWidth={false}
                maxWidth="100%"
                maxHeight="80%"
                />}
        header={tournament.name}
        // meta={tournament.location}
        description={`${tournament.teams.length} teams`}
        style={{width: '30%', minHeight: 200}}
        onClick={handleOnClick}
        />
        )
}