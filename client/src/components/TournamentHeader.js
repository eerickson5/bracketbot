import React from "react";
import { Header } from 'semantic-ui-react'
import DynamicImage from "./DynamicImage";
import TournamentContext from "../TournamentContextProvider";

import { isSingleEmoji } from "../emojiFunctions";
//TODO: emojis hello
export default function TournamentHeader(){
    const [tournament] = React.useContext(TournamentContext)
    return(
        <div style={{position: 'relative', width: "100%", minHeight: 200}}>
            <DynamicImage image={tournament.image} isFullWidth/>
            <Header as="h1" size="huge" 
            inverted={isSingleEmoji(tournament.image) ? false : true} 
            style={{
                position: 'absolute',
                left: '50%',
                bottom: '15%', 
                transform: 'translateX(-50%)',
                textShadow: isSingleEmoji(tournament.image)
                ? '0 0 10px white, 0 0 20px white, 0 0 30px white, 0 0 40px white, 0 0 50px white'
                : 'none',
            }}>{tournament.name}</Header>
        </div>
        
    )
}