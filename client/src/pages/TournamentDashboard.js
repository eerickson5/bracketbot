import React, { useEffect, useState } from "react";
import {
    Container
  } from 'semantic-ui-react'

import TournamentCard from "../components/TournamentCard";
import GameCard from "../components/GameCard";

export default function TournamentDashboard(){
  const tourney = {
    image:'https://universe.byu.edu/wp-content/uploads/2019/07/AP19204604544330-1.jpg',
    name:'Round Robin',
    location:'Applewood Park',
    numTeams: 16,
    numPools: 4,
    numBrackets: 2
  }

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
      <TournamentCard tournament={tourney}/>
      <GameCard game={game}/>
    </Container>
     
    )
}