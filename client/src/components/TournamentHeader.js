import React from "react";
import { Header } from 'semantic-ui-react'
import DynamicImage from "./DynamicImage";

export default function TournamentHeader({image, name}){
    return(
        <div style={{position: 'relative', width: "100%"}}>
            <DynamicImage image={image} isFullWidth/>
            <Header as="h1" size="huge" inverted style={{
                position: 'absolute',
                right: '50%',
                left: '50%',
                bottom: '15%',
            }}>{name}</Header>
        </div>
        
    )
}