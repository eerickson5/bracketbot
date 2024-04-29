import React, { useContext, useEffect, useState } from "react";
import DragAndDropPools from "../components/DragAndDropPools";
import CreatePoolsForm from "../components/CreatePoolsForm"
import TournamentContext from "../TournamentContextProvider";
import { Container } from "semantic-ui-react";
import PoolVisualizer from "../components/PoolVisualizer";

export default function PoolsDashboard(){
    const [tournament, setTournament] = useContext(TournamentContext)
    const [pools, setPools] = useState([])
    const [teamPools, setTeamPools] = useState([])
    const [currPage, setPage] = useState(0)

    useEffect(() => {
        setPools(tournament.stages.filter(stage => !stage.is_bracket))
    }, [tournament])

    const creationPages = [
        <DragAndDropPools pools={pools} onSubmitPools={teamArrays => {
            setTeamPools(teamArrays)
            setPage(1)
        }}/>,
        //TODO: remove tournament prop drill from this one too
        <CreatePoolsForm tournament={tournament} teamArrays={teamPools} onGoBack={() => setPage(0)}/>
    ]

    const getTeamLists = () => {
        return pools
        .filter(pool => pool.name !== "Crossovers")
        .map(pool => {
            let teams = []
            for(const game of pool.games){
                if (!teams.some(team => team.id === game.teams[0].id))
                    teams.push(game.teams[0]);
                
                if (!teams.some(team => team.id === game.teams[1].id)) 
                    teams.push(game.teams[1]);
            }
            return {"teams": teams, "poolName": pool.name}
        })
    }
    
    if(!pools.length)
        return creationPages[currPage]
    else{
        console.log(getTeamLists())
        return (
            <Container>
                {getTeamLists().map(pool => <PoolVisualizer poolName={pool.poolName} teams={pool.teams}/>)}
            </Container>  
        )
    }
}