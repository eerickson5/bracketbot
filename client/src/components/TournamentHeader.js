import React from "react";
import { Header } from 'semantic-ui-react'
import DynamicImage from "./DynamicImage";
import TournamentContext from "../TournamentContextProvider";

//TODO: emojis hello
export default function TournamentHeader(){
    const [tournament] = React.useContext(TournamentContext)
    return(
        <div style={{position: 'relative', width: "100%"}}>
            <DynamicImage image={tournament.image} isFullWidth/>
            <Header as="h1" size="huge" inverted style={{
                position: 'absolute',
                right: '50%',
                left: '50%',
                bottom: '15%',
            }}>{tournament.name}</Header>
        </div>
        
    )
}