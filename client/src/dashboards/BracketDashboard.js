import React, { useContext, useEffect, useState } from "react";
import TournamentContext from "../TournamentContextProvider";
import CreateBracketForm from "../components/CreateBracketForm";
import BracketSchedule from "../components/BracketSchedule";

export default function BracketDashboard(){

    const [tournament, setTournament] = useContext(TournamentContext)
    const [poolsComplete, setPoolsComplete] = useState(true)
    const [bracket, setBracket] = useState()

    useEffect( () => {
        if(tournament)
            fetch(`/pools_completed/${tournament.id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            .then(res => res.json())
            .then(data => {
                setPoolsComplete(data.completed)
            })
            .catch(e => console.log(e))
        if(tournament.stages.length){
            const stages = tournament.stages
                .map((data, index) => ({...data, poolIndex: index}))
                .filter(stage => stage.is_bracket)
            if (stages.length)
                setBracket(stages[0])
        }
            

            
    }, [tournament])

    
    return !poolsComplete 
    ? <h2>Brackets cannot be created until every pool game has a score.</h2>
    : bracket
    ? <BracketSchedule/>
    : <CreateBracketForm/>
}