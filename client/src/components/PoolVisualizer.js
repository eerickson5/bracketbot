import React, { useContext } from "react";
import { Container } from "semantic-ui-react";
import TeamCard from "./TeamCard";

export default function PoolVisualizer({poolName, teams}){
    console.log(teams)
    return(
        <Container>
            <h4>{poolName}</h4>
            {
                teams.map(team => <TeamCard team={team}/>)
            }
        </Container>
    )
}