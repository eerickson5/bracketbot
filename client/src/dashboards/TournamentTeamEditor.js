import React, { useState } from "react";
import TeamAdder from "../components/TeamAdder";
import { Container, Button } from "semantic-ui-react";
import TournamentContext from "../TournamentContextProvider";

export default function TournamentTeamEditor(){
    const [tournament, setTournament] = React.useContext(TournamentContext)
    const [teams, setTeams] = useState(Object.values(tournament.teams))
    const [error, setError] = useState("")

//TODO: why isn't it automatic :( TeamAdder receives an empty array
    const handleEditTeams = () => {
        if(teams.length < 4){
            setError("Whoops! You need at least 4 teams in a tournament.")
        } else {
            fetch(`/api/tournament/${tournament.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"teams": teams, "operation": "rationalize_teams"}),
            }).then(res => res.json())
            .then(newTournament => {
                setTournament(newTournament)
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
            <h2>Add or remove teams before generating game schedules</h2>
            <TeamAdder teams={teams} onEditTeams={(newTeams) => setTeams(newTeams)}/>
            <h4 style={{color: 'red', marginBlock: 20}}>{error}</h4>
            <Button content='Submit New Teams' size="large" onClick={handleEditTeams}/>
        </Container>
    )
}