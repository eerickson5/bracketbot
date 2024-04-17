import React, { useState } from "react";
import TeamAdder from "./TeamAdder";
import { Container, Button } from "semantic-ui-react";

export default function TournamentTeamDashboard({tournament}){
    const [teams, setTeams] = useState(tournament.teams)
    const [error, setError] = useState("")

    //TODO: if teams already have a game, can't add new ones
    const handleEditTeams = () => {
        if(teams.length <= 4){
            setError("Whoops! You need at least 4 teams in a tournament.")
        } else {
            fetch("http://localhost:5555/tournament/teams", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({teams: teams, tournament_id: tournament.id}),
            }).then(res => res.json())
            .then(tournament => {
                console.log("yay")
            })
            .catch(e => setError(e))
        }
    }

    return (
        <Container>
            <h2 style={{marginBottom: 20}}>Edit Team List</h2>
            <TeamAdder teams={teams} onEditTeams={(newTeams) => setTeams(newTeams)}/>
            <h4 style={{color: 'red', marginBlock: 20}}>{error}</h4>
            <Button content='Submit New Teams' size="large" onClick={handleEditTeams}/>
        </Container>
    )
}