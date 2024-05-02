import React, { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardMeta, CardDescription, Input } from 'semantic-ui-react'
import TournamentContext from "../TournamentContextProvider";

export default function GameCard({game, scoreEditable}){

    const [tournament, setTournament] = useContext(TournamentContext)

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

    const handleSubmitScore = (e) => {
        const { name, value } = e.target;
        if(value === ""){
            return
        }
        fetch(`http://localhost:5555/game_score/${name === 'score0' ? game.game_scores[0].id : game.game_scores[1].id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                team_id: name === 'score0' ? team0.id : team1.id,
                new_score: value,
            }),
        })
        .then(response => response.json())
        .then(gameScore => {
            console.log('will edit tournament')
            const gameScoreIndex = value === 'score0' ? 0 : 1
            // const updateTournament = {
            //     ...tournament,
            //     stages[gameScore.game.stage_id].games[gameScore.game.id].game_score[gameScoreIndex].own_score = value
            // }
            
            // stage[game.stage.id] -> games[game.id] -> game_score['score0' ? game.game_scores[0].id : game.game_scores[1].id] -> own_score
            //dig into the tournament object to change this game_score
        })
        .catch(error => {
            console.error('Error updating score:', error);
        });
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
                    <Input placeholder='0' fluid style={{minWidth: 55}} 
                    name={"score0"} value={scores["score0"]} 
                    onChange={handleChange}
                    onBlur={handleSubmitScore}/>
                    vs
                    <Input placeholder='0' fluid style={{minWidth: 55}} 
                    name={"score1"} value={scores["score1"]} 
                    onChange={handleChange}
                    onBlur={handleSubmitScore}/>
                    {team1.image}
                </div>
            </CardContent>
            :<CardDescription>{`${team0.image} ${game.game_scores[0].own_score ?? 0} - ${game.game_scores[1].own_score ?? 0} ${team1.image}`}</CardDescription>
            }
            
        </Card>
    )
}