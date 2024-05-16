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
  const [isOwner, setIsOwner] = useState(false)

  //todo: change when anything about the tournament changes via the other menus
  useEffect(() => {
    fetch(`/api/tournament/${tourn_id}`)
    .then(res => res.json())
    .then(data => {
      setTournament({...data.tournament, teams: data.teams})
    }) 
    .catch(e => console.log(e))
  }, [tourn_id, setTournament])

  useEffect(() => {
    fetch(`/api/check_user`)
    .then(res => res.json())
    .then(data => {
      if (data.user.id === tournament.user_id){
        setIsOwner(true)
      } else {
        setIsOwner(false)
      }
    })
  }, [setIsOwner, tournament.user_id])

    if(isOwner)
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
    else{
      return(
        <Container>
          <TournamentHeader/>
          <TournamentDashboard/>
        </Container>
      )}
}