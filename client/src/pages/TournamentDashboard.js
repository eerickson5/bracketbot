import React, { useEffect, useState } from "react";
import { Container, Button} from 'semantic-ui-react'
import { useParams } from "react-router-dom";
import GameCard from "../components/GameCard";
import TeamCard from "../components/TeamCard";
import TournamentHeader from "../components/TournamentHeader";
import TournamentMenu from "../components/TournamentMenu";

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
        <TournamentHeader name={tournament.name} image={tournament.image}/>
        <TournamentMenu/>

        <Container>
          <h2>Teams</h2>
          { tournament.teams.map( team => <TeamCard team={team} key={team.id}/>) }
        </Container>
        <Button
          content='Like'
          icon='heart'
          label={{ as: 'a', basic: true, content: '2,048' }}
          labelPosition='right'
          size='huge'
        />
        
      </Container>
     
    )
}