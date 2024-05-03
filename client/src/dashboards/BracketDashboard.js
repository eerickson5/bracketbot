import React, { useContext, useEffect, useState } from "react";
import TournamentContext from "../TournamentContextProvider";
import CreateBracketForm from "../components/CreateBracketForm";

export default function BracketDashboard(){

    const [tournament, setTournament] = useContext(TournamentContext)
    const [poolsComplete, setPoolsComplete] = useState(true)

    useEffect( () => {
        if(tournament)
            fetch(`http://localhost:5555/pools_completed/${tournament.id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            .then(res => res.json())
            .then(data => {
                setPoolsComplete(data.completed)
            })
            .catch(e => console.log(e))
    }, [tournament])

    
    return !poolsComplete 
    ? <h2>Brackets cannot be created until every pool game has a score.</h2>
    : <CreateBracketForm/>
}