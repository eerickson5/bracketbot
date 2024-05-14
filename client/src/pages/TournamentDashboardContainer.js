import React, { useContext, useEffect, useState } from "react";
import { Container } from 'semantic-ui-react'
import { useParams } from "react-router-dom";
import TournamentHeader from "../components/TournamentHeader";
import TournamentMenu from "../components/TournamentMenu";
import TournamentDashboard from "../dashboards/TournamentDashboard";
import PoolsDashboard from "../dashboards/PoolsDashboard";
import TournamentContext from "../TournamentContextProvider"
import BracketDashboard from "../dashboards/BracketDashboard";
import Settings from "../dashboards/Settings";

export default function TournamentDashboardContainer(){

  const [tournament, setTournament] = useContext(TournamentContext)
  const tourn_id = useParams().id
  const [selectedMenu, setSelectedMenu] = useState("home")

  //todo: change when anything about the tournament changes via the other menus
  useEffect(() => {
    fetch(`/api/tournament/${tourn_id}`)
    .then(res => res.json())
    .then(data => {
      setTournament({...data.tournament, teams: data.teams})
    }) 
    .catch(e => console.log(e))
  }, [tourn_id, setTournament])


    return(
        <Container>
          <TournamentHeader/>
          <TournamentMenu selectedMenu={selectedMenu} onSelectMenu={(menu) => setSelectedMenu(menu)}/>
          {selectedMenu === "home" 
          ? <TournamentDashboard/>
          : selectedMenu === "pools" 
          ? <PoolsDashboard /> 
          : selectedMenu === "bracket"
          ? <BracketDashboard/>
          : <Settings/>}
        </Container>
    )
}