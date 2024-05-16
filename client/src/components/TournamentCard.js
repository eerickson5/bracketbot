import React from "react";
import { Card, Divider, Header, Segment } from 'semantic-ui-react'
import { isSingleEmoji } from "../emojiFunctions";
import DynamicImage from "./DynamicImage";

export default function TournamentCard({tournament}){
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
        />
        )
}