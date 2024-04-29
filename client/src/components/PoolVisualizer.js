import React from "react";
import TeamCard from "./TeamCard";

export default function PoolVisualizer({poolName, teams}){
    return(
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 10}}>
            <h3>{poolName}</h3>
            { teams.map(team => <TeamCard team={team}/>) }
        </div>
    )
}