import React from "react";
import { Form, FormInput, FormRadio, Segment, Grid, Button, Container } from 'semantic-ui-react'
import TeamCard from "./TeamCard";

export default function TeamAdder({teams, onEditTeams}){

    let removeTeam = (team) => {
        let newTeams = teams.filter(newTeam => newTeam !== team)
        onEditTeams(newTeams)
    }

    let teamCards = teams.map( (team, index )=> (<TeamCard key={index} team={team} onRemoveTeam={removeTeam}/>))
    return(
        <Container >
            {teamCards}
        </Container>
        
    )
}