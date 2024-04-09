import React, { useEffect, useState } from "react";
import {
    Card, CardContent, CardHeader, CardMeta, CardDescription, Container
  } from 'semantic-ui-react'

import TournamentCard from "../components/TournamentCard";

export default function TournamentDashboard(){
  const tourney = {image:'https://universe.byu.edu/wp-content/uploads/2019/07/AP19204604544330-1.jpg',
  name:'Round Robin',
  location:'Applewood Park',
  numTeams: 16,
  numPools: 4,
  numBrackets: 2}

  
    return(
    <Container>
      <TournamentCard tournament={tourney}/>
    </Container>
     
    )
}