import React, { useState } from "react";
import TeamAdder from "../components/TeamAdder";
import { Container, Button } from "semantic-ui-react";

export default function TournamentTeamDashboard({tournament, onUpdateTournament}){
    const [teams, setTeams] = useState(tournament.teams)
    const [error, setError] = useState("")

    //TODO: if teams already have a game, can't add new ones
    const handleEditTeams = () => {
        if(teams.length < 4){
            setError("Whoops! You need at least 4 teams in a tournament.")
        } else {
            fetch(`http://localhost:5555/tournament/${tournament.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"teams": teams, "operation": "rationalize_teams"}),
            }).then(res => res.json())
            .then(newTournament => {
                onUpdateTournament(newTournament)
            })
            .catch(e => resetFromError(e))
        }
    }

    const resetFromError = (e) => {
        setError(e.error)
        setTeams(tournament.teams)
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