import React, { useContext, useEffect, useState } from "react";
import { Container } from 'semantic-ui-react'
import { useParams } from "react-router-dom";
import TournamentHeader from "../components/TournamentHeader";
import TournamentMenu from "../components/TournamentMenu";
import TournamentDashboard from "../dashboards/TournamentDashboard";
import TournamentTeamDashboard from "../dashboards/TournamentTeamDashboard";
import PoolsDashboard from "../dashboards/PoolsDashboard";
import TournamentContext from "../TournamentContextProvider"

export default function TournamentDashboardContainer(){

  const [tournament, setTournament] = useContext(TournamentContext)
  const tourn_id = useParams().id
  const [selectedMenu, setSelectedMenu] = useState("home")

  //todo: change when anything about the tournament changes via the other menus
  useEffect(() => {
    fetch(`http://localhost:5555/tournament/${tourn_id}`).then(res => res.json())
    .then(data => {
      setTournament({...data.tournament, teams: data.teams})
    })
    .catch(e => console.log(e))
  }, [tourn_id, setTournament])


    return(
        <Container>
          <TournamentHeader/>
          <TournamentMenu selectedMenu={selectedMenu} onSelectMenu={(menu) => setSelectedMenu(menu)}/>
{/* TODO: teams can't be changed once pools are finalized */}
          {selectedMenu === "home" 
          ? <TournamentDashboard/> 
          : selectedMenu === "teams"
          ? <TournamentTeamDashboard/>
          : <PoolsDashboard /> }
        </Container>
      
     
    )
}