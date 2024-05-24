import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardMeta, CardDescription, Input } from 'semantic-ui-react'

export default function GameCard({game, onSubmitScore = null}){


    const[scores, setScores] = useState({
        "score0": "", 
        "score1": ""
    })

    const [gameScores] = useState(
        [...game.game_scores].sort((a, b) => {
            if (a && b)
              return a.id - b.id;
            else
              return 0; // or any other appropriate value, such as `1` or `-1`
          })
    )

    useEffect(() => {
        if(gameScores.length === 2)
            setScores({
                "score0": gameScores[0].own_score ?? "", 
                "score1": gameScores[1].own_score ?? ""
            })
    }, [gameScores])

    const metaText = <p>
        {game.location + " | "} 
        <span style={{color:game.poolColor}}>{game.stage.name}</span> 
        {" | " + game.readable_time}
        </p>

    if(!gameScores.length){
        return(
            <Card fluid
            header={<h5>? vs ?</h5>}
            meta={metaText}
            />
        )
    } else if (gameScores.length === 1){
        return(
            <Card fluid style={{padding: 10}}
            header={<h5>{gameScores[0].team.team_name} vs ?</h5>}
            meta={metaText}
            />
        )
    }


    const team0 = gameScores[0].team
    const team1 = gameScores[1].team

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
            gameScoreId: e.target.name === 'score0' ? gameScores[0].id : gameScores[1].id,
            gameIndex: game.gameIndex,
            poolIndex: game.poolIndex
        })
    }

    return (
        <Card fluid style={{padding: 10}}>
            <CardHeader>
                <h5>{team0.image}{team0.team_name} vs {team1.team_name}{team1.image}</h5>
            </CardHeader>
            <CardMeta>{metaText}</CardMeta>
            {onSubmitScore && !game.scores_locked
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
            :<CardDescription>{`${team0.image} ${gameScores[0].own_score ?? 0} - ${game.game_scores[1].own_score ?? 0} ${team1.image}`}</CardDescription>
            }
            
        </Card>
    )
}