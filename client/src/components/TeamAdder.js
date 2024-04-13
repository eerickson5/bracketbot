import React from "react";
import { Input, Container, Button } from 'semantic-ui-react'
import TeamCard from "./TeamCard";
import { useState } from "react";
import { isSingleEmoji } from "../isSingleEmoji";

//eVENT.preventdefault
export default function TeamAdder({teams, onEditTeams}){

    const [name, setName] = useState("")
    const [emoji, setEmoji] = useState("")
    const [errorMessage, setErrorMessage] = useState("")


    let removeTeam = (team) => {
        let newTeams = teams.filter(newTeam => newTeam !== team)
        console.log(newTeams.length)
        onEditTeams(newTeams)
    }
    
    let addTeam = () => {
        if(name.length < 1){
            setErrorMessage("Give your team a name!")
        } else if(teams.includes(name)) {
            setErrorMessage("A team with this name already exists.")
        } else {
            onEditTeams([...teams, {name: name, image: emoji}])
        }

        //if team name is valid and doesn't already exist
        //if if is a singular emoji
        //send up
    }

    function changeEmoji(string){
        if(isSingleEmoji(string) || string.length === 0){
            setEmoji(string)
        } 
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
                onChange={(e, {name, value}) => changeEmoji(value)} value={emoji}/>

                <Button secondary onClick={addTeam}>Add Team</Button>
            </Container>
            <Container>
                {teamCards}
            </Container>
        </div>
    )
}