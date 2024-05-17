import React, { useEffect, useState } from "react";
import { Container, Button, Segment } from "semantic-ui-react";
import TournamentCard from '../components/TournamentCard'
import { useNavigate } from "react-router-dom";

        //TODO: if not logged in, reroute to login
export default function MyTournaments(){

    const navigate = useNavigate()

    const [tournaments, setTournaments] = useState([])
    useEffect( () => {
        fetch(`/api/my_tournaments`)
        .then(res => res.json())
        .then(response => {
            setTournaments(response.tournaments)
        })
        .catch(e => console.log(e))
    }, [])

    const handleTournamentClick = (tournament) => {
        navigate(`/tournament/${tournament.id}`)
    }

    const handleLogout = () => {
        fetch(`/api/logout`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(res => {
            if (res.status === 204) {
                navigate("/")
            }
          })
        .catch(e => console.log(e))
    }

    return(
        <div style={{display: 'flex', justifyContent: 'center', padding: 20, flexDirection: 'column'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignSelf: 'stretch'}}>
                <Button content='Home Page' icon='home' />
                <Button content='Log Out'  icon='user' onClick={handleLogout}/>
            </div>
            
            <Segment color="red">
                <h1 style={{paddingBlock: 20, alignSelf: 'center', textAlign: 'center'}}>Your Tournaments</h1>
                <Container style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {tournaments.map(tournament => <TournamentCard tournament={tournament} key={tournament.id} handleOnClick={() => handleTournamentClick(tournament)}/>)}
                </Container>
            </Segment>
        </div>
       
        
    )
}