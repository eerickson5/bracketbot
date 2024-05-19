import React, { useEffect, useState } from "react";
import { Container, Button, Segment, Icon } from "semantic-ui-react";
import TournamentCard from '../components/TournamentCard'
import { useNavigate } from "react-router-dom";

export default function MyTournaments(){

    const navigate = useNavigate()

    const [tournaments, setTournaments] = useState([])
    useEffect( () => {
        fetch(`/api/my_tournaments`)
        .then(res => {
            if(!res.ok)
                throw new Error(res.status)
            return res.json()
        
        })
        .then(response => {
            setTournaments(response.tournaments)
        })
        .catch(_ => navigate("/login"))
    }, [navigate])

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
                <Button content='Log Out'  icon='user' onClick={handleLogout}/>
            </div>
            
            <Segment color="red">
                <h1 style={{paddingBlock: 20, alignSelf: 'center', textAlign: 'center'}}>Your Tournaments</h1>
                <Container style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', }}>
                    <Button color='white' onClick={() => navigate('/tournament/new')}
                    style={{height: 200, width: 275, alignSelf:'center'}}>
                        <h2>➕<br/> Create New Tournament </h2>
                    </Button>
                    {tournaments.map(tournament => <TournamentCard tournament={tournament} key={tournament.id} handleOnClick={() => navigate(`/tournament/${tournament.id}`)}/>)}
                </Container>
            </Segment>
        </div>
       
        
    )
}