import React, { useEffect, useState } from "react";
import { Container, Button} from 'semantic-ui-react'
import { useParams } from "react-router-dom";
import TournamentHeader from "../components/TournamentHeader";
import TournamentMenu from "../components/TournamentMenu";
import TournamentDashboard from "../components/TournamentDashboard";
import TournamentTeamDashboard from "../components/TournamentTeamDashboard";
import PoolsDashboard from "../components/PoolsDashboard";

export default function TournamentDashboardContainer(){

  const tourn_id = useParams().id
  const [tournament, setTournament] = useState({teams:[]})
  const [selectedMenu, setSelectedMenu] = useState("home")

  //todo: change when anything about the tournament changes via the other menus
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
        <TournamentMenu selectedMenu={selectedMenu} onSelectMenu={(menu) => setSelectedMenu(menu)}/>

        {selectedMenu === "home" 
        ? <TournamentDashboard tournament={tournament}/> 
        : selectedMenu === "teams"
        ? <TournamentTeamDashboard tournament={tournament} onUpdateTournament={setTournament}/>
        : <PoolsDashboard tournament={tournament} onUpdateTournament={setTournament}/> }
      </Container>
     
    )
}