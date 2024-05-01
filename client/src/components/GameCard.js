import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardMeta, CardDescription, Input } from 'semantic-ui-react'

export default function GameCard({game, scoreEditable}){

    const team0 = game.game_scores[0].team
    const team1 = game.game_scores[1].team
    const[scores, setScores] = useState({
        "score0": team0.own_score ?? "", 
        "score1": team1.own_score ?? ""
    })

    const handleChange = (e) => {
        if(Number.isInteger(Number(e.target.value))){
            setScores({
                ...scores,
                [e.target.name]: e.target.value
            })
        }
    }

    return (
        <Card fluid style={{padding: 10}}>
            <CardHeader>
                <h3>{team0.image}{team0.team_name} vs {team1.team_name}{team1.image}</h3>
            </CardHeader>
            <CardMeta>{game.location + " | " + game.stage.name}</CardMeta>
            {scoreEditable
            ?<CardContent>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    {team0.image}
                    <Input placeholder='0' fluid style={{minWidth: 50}} 
                    name={"score0"} value={scores["score0"]} onChange={handleChange}/>
                    vs
                    <Input placeholder='0' fluid style={{minWidth: 50}} 
                    name={"score1"} value={scores["score1"]} onChange={handleChange}/>
                    {team1.image}
                </div>
            </CardContent>
            :<CardDescription>{`${team0.image} ${game.game_scores[0].own_score ?? 0} - ${game.game_scores[1].own_score ?? 0} ${team1.image}`}</CardDescription>
            }
            
        </Card>
    )
}