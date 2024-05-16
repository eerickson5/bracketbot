import React, { useEffect, useState } from "react";
import { Segment } from "semantic-ui-react";
import TournamentCard from '../components/TournamentCard'
        //TODO: if not logged in, reroute to login
export default function MyTournaments(){

    const [tournaments, setTournaments] = useState([])
    useEffect( () => {
        fetch(`/my_tournaments/`)
        .then(res => res.json())
        .then(response => {
            console.log(response)
            setTournaments(response.tournaments)
        })
        .catch(e => console.log(e))
    }, [])

    return(
        <div style={{display: 'flex', justifyContent: 'center', padding: 30}}>
             <Segment color="red">
                <h1>Your Tournaments</h1>
                {tournaments.map(tournament => <TournamentCard tournament={tournament}/>)}
            </Segment>
        </div>
       
        
    )
}