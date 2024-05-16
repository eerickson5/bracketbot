import React, { useEffect, useState } from "react";
import { Container, Segment } from "semantic-ui-react";
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

    const handleClick = (tournament) => {
        navigate(`/tournament/${tournament.id}`)
    }

    //debug this by using /localhost:5555 to send the get request?
    return(
        <div style={{display: 'flex', justifyContent: 'center', padding: 30}}>
             <Segment color="red">
                <h1 style={{paddingBlock: 20, alignSelf: 'center', textAlign: 'center'}}>Your Tournaments</h1>
                <Container style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {tournaments.map(tournament => <TournamentCard tournament={tournament} key={tournament.id} handleOnClick={() => handleClick(tournament)}/>)}
                </Container>
            </Segment>
        </div>
       
        
    )
}