import React from "react";
import { Input, Container, Button } from 'semantic-ui-react'
import TeamCard from "./TeamCard";
import { useState } from "react";

//eVENT.preventdefault
export default function TeamAdder({teams, onEditTeams}){

    const [name, setName] = useState("")
    const [emoji, setEmoji] = useState("")


    let removeTeam = (team) => {
        let newTeams = teams.filter(newTeam => newTeam !== team)
        console.log(newTeams.length)
        onEditTeams(newTeams)
    }
    
    let addTeam = () => {
        //if team name is valid and doesn't already exist
        //if if is a singular emoji
        //send up
    }

    function isEmoji(string) {
        const emojiRegex = /\p{Extended_Pictographic}/u;

        if (emojiRegex.test(string)){
          return(true);
        }
      
        return(false);
    }

    let teamCards = teams.map( (team, index )=> (<TeamCard key={index} team={team} onRemoveTeam={removeTeam}/>))
    return(
        <div>
            <Container>
                <Input 
                icon='add user' iconPosition='left' placeholder='Team name...'  style={{marginBottom: 10, marginInline: 5}}
                onChange={(e, {name, value}) => setName(value)} value={name}/>
                <Input 
                icon='smile' iconPosition='left' placeholder='Emoji..'  style={{marginBottom: 10, marginInline: 5}}
                onChange={(e, {name, value}) => setEmoji(value)} value={emoji}/>

                <Button secondary onPress={addTeam}>Add Team</Button>
            </Container>
            <Container>
                {teamCards}
            </Container>
        </div>
    )
}