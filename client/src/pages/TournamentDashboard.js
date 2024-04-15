import React, { useEffect, useState } from "react";
import { Container, Segment } from 'semantic-ui-react'
import { useParams } from "react-router-dom";
import TournamentCard from "../components/TournamentCard";
import GameCard from "../components/GameCard";
import TeamCard from "../components/TeamCard";
import DynamicImage from "../components/DynamicImage";
import TournamentHeader from "../components/TournamentHeader";

export default function TournamentDashboard(){

  const tourn_id = useParams().id
  const [tournament, setTournament] = useState({teams:[]})

  useEffect(() => {

    fetch(`http://localhost:5555/tournament/${tourn_id}`).then(res => res.json())
    .then(data => {
      setTournament(data)
    })
    .catch(e => console.log(e))
  }, [tourn_id])

    return(
      <Container>
        <Container textAlign='center' style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
          <TournamentHeader name={tournament.name} image={tournament.image}/>
          
        </Container>
        <Container>
          <h2>Teams</h2>
          { tournament.teams.map( team => <TeamCard team={team} key={team.id}/>) }
        </Container>
      </Container>
     
    )
}