import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardMeta, CardDescription, Input } from 'semantic-ui-react'

export default function GameCard({game, onSubmitScore = null}){

    const team0 = game.game_scores[0].team
    const team1 = game.game_scores[1].team
    const[scores, setScores] = useState({
        "score0": game.game_scores[0].own_score ?? "", 
        "score1": game.game_scores[1].own_score ?? ""
    })

    const handleChange = (e) => {
        if(Number.isInteger(Number(e.target.value)) && Number(e.target.value) < 200){
            setScores({
                ...scores,
                [e.target.name]: Number(e.target.value)
            })
        }
    }

    const handleOnSubmitScore = (e) => {
        if(e.target.value === ""){
            return
        }
        onSubmitScore({
            teamId: e.target.name === 'score0' ? team0.id : team1.id,
            newScore: Number(e.target.value),
            gameScoreId: e.target.name === 'score0' ? game.game_scores[0].id : game.game_scores[1].id,
            gameIndex: game.gameIndex,
            poolIndex: game.poolIndex
        })
    }

    return (
        <Card fluid style={{padding: 10}}>
            <CardHeader>
                <h3>{team0.image}{team0.team_name} vs {team1.team_name}{team1.image}</h3>
            </CardHeader>
            <CardMeta>{game.location + " | " + game.stage.name}</CardMeta>
            {onSubmitScore
            ?<CardContent>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    {team0.image}
                    <Input placeholder='-' fluid style={{minWidth: 55}} 
                    name={"score0"} value={scores["score0"]} 
                    onChange={handleChange}
                    onBlur={handleOnSubmitScore}/>
                    vs
                    <Input placeholder='-' fluid style={{minWidth: 55}} 
                    name={"score1"} value={scores["score1"]} 
                    onChange={handleChange}
                    onBlur={handleOnSubmitScore}/>
                    {team1.image}
                </div>
            </CardContent>
            :<CardDescription>{`${team0.image} ${game.game_scores[0].own_score ?? 0} - ${game.game_scores[1].own_score ?? 0} ${team1.image}`}</CardDescription>
            }
            
        </Card>
    )
}