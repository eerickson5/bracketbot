import React from "react";
import { Input, Container, Button } from 'semantic-ui-react'
import TeamCard from "./TeamCard";
import { useState } from "react";
import { isSingleEmoji, randomEmoji } from "../emojiFunctions";

//eVENT.preventdefault
export default function TeamAdder({teams, onEditTeams}){
    const [name, setName] = useState("")
    const [emoji, setEmoji] = useState("")
    const [errorMessage, setErrorMessage] = useState("")


    const removeTeam = (team) => {
        let newTeams = teams.filter(newTeam => newTeam !== team)
        onEditTeams(newTeams)
    }
    
    const addTeam = () => {
        if(name.length < 1){
            setErrorMessage("Give your team a name!")
        } else if (teams.some(existingTeam => existingTeam["name"] === name)) {
            setErrorMessage(`A team with the name ${name} already exists.`)
        } else {
            onEditTeams([...teams, {team_name: name, image: isSingleEmoji(emoji) ? emoji : randomEmoji()}])
            setName("")
            setEmoji("")
            setErrorMessage("")
        }
    }

    function changeEmoji(string){
        if(isSingleEmoji(string) || string.length === 0){
            setEmoji(string)
        } 
    }

    return(
        <div>
            <Container>
                <Input 
                icon='add user' iconPosition='left' placeholder='Team name...'  style={{marginBottom: 10, marginInline: 5}}
                onChange={(e, {value}) => setName(value)} value={name}/>
                <Input 
                icon='smile' iconPosition='left' placeholder='Emoji..'  style={{marginBottom: 10, marginInline: 5}}
                onChange={(e, {value}) => changeEmoji(value)} value={emoji}/>

                <Button type="button" secondary onClick={addTeam}>Add Team</Button>
            </Container>
            <Container>
                <p>{errorMessage}</p>
                {teams.map( (team, index )=> (<TeamCard key={index} team={team} onRemoveTeam={removeTeam}/>))}
            </Container>
        </div>
    )
}