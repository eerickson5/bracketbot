import React, { useContext, useEffect, useState } from "react";
import { Container, Button} from 'semantic-ui-react'
import { useParams } from "react-router-dom";
import GameCard from "../components/GameCard";
import TeamCard from "../components/TeamCard";
import TournamentContext from "../TournamentContextProvider";

export default function TournamentDashboard(){
  const [tournament, setTournament] = useContext(TournamentContext)
    return(
      <Container>
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