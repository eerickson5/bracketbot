import React, { useEffect, useState } from "react";
import {
    Container, Grid
  } from 'semantic-ui-react'
import { useParams } from "react-router-dom";
import TournamentCard from "../components/TournamentCard";
import GameCard from "../components/GameCard";
import TeamCard from "../components/TeamCard";

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

  const game = {
    location: 'Field C',
    game_scores: [
      {
        team: {
          name: "Magma"
        },
        own_score: 15
      },
      {
        team: {
          name: "Ozone"
        },
        own_score: 13
      }
    ],
    stage: {
      name: "Pool B"
    }
  }


    return(
      <Container>
        <TournamentCard tournament={tournament}/>
        <GameCard game={game}/>

        <Container>
          <h2>Teams</h2>
          {
            tournament.teams.map( team => <TeamCard team={team} key={team.id}/>)
          }
        </Container>
      </Container>
     
    )
}