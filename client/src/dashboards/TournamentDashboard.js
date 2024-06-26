import React, { useContext } from "react";
import { Container } from 'semantic-ui-react'
import TeamCard from "../components/TeamCard";
import TournamentContext from "../TournamentContextProvider";
import ScheduleDisplay from "../components/ScheduleDisplay";
import TournamentTeamEditor from "./TournamentTeamEditor";

//TODO: once pools are submitted... the ui isn't automatically updated ?? and then if I try to navigate it freaks out??
//TODO: teams are not automatically fetched :/
export default function TournamentDashboard(){
  const [tournament] = useContext(TournamentContext)
  console.log(tournament)
    return(
      <Container style={{paddingBottom: 20}}>

        {tournament.stages.length 
          ? <Container style={{margin: 30}}>
              <h2>Teams</h2>
              { Object.values(tournament.teams).map( team => <TeamCard team={team} key={team.id}/>) }
            </Container>
          : <TournamentTeamEditor/>
        }
      
        <Container>
          <ScheduleDisplay 
            pools={tournament.stages.filter(stage => !stage.is_bracket)} 
            title="Pool Play Schedule" 
            subtitle="colored by pool / crossover"
            />
          <ScheduleDisplay 
            pools={tournament.stages.filter(stage => stage.is_bracket)} 
            title="Bracket Play Schedule"
            />
        </Container>
        
      </Container>
     
    )
}