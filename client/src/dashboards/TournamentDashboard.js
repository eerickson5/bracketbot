import React, { useContext, useEffect, useState } from "react";
import { Container, Button} from 'semantic-ui-react'
import TeamCard from "../components/TeamCard";
import TournamentContext from "../TournamentContextProvider";
import ScheduleDisplay from "../components/ScheduleDisplay";
import TournamentTeamEditor from "./TournamentTeamEditor";

export default function TournamentDashboard(){
  const [tournament, setTournament] = useContext(TournamentContext)
    return(
      <Container style={{paddingBottom: 20}}>

        {tournament.stages 
          ? <TournamentTeamEditor/>
          : <Container>
              <h2>Teams</h2>
              { Object.values(tournament.teams).map( team => <TeamCard team={team} key={team.id}/>) }
            </Container>
        }
      
        <Container>
          <ScheduleDisplay pools={tournament.stages.filter(stage => !stage.is_bracket)}/>
        </Container>
        
      </Container>
     
    )
}