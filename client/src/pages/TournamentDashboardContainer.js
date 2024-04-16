import React, { useEffect, useState } from "react";
import { Container, Button} from 'semantic-ui-react'
import { useParams } from "react-router-dom";
import TournamentHeader from "../components/TournamentHeader";
import TournamentMenu from "../components/TournamentMenu";
import TournamentDashboard from "../components/TournamentDashboard";
import TournamentTeamDashboard from "../components/TournamentTeamDashboard";

export default function TournamentDashboardContainer(){

  const tourn_id = useParams().id
  const [tournament, setTournament] = useState({teams:[]})
  const [selectedMenu, setSelectedMenu] = useState("")

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

        {selectedMenu === "" ? <TournamentDashboard tournament={tournament}/> : <TournamentTeamDashboard tournament={tournament}/>}
        
      </Container>
     
    )
}