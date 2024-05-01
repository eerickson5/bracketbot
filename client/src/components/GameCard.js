import React from "react";
import { Card, CardContent, CardHeader, CardMeta, CardDescription, Input } from 'semantic-ui-react'

export default function GameCard({game, scoreEditable}){
    return (
        <Card fluid style={{padding: 10}}>
            <CardHeader>
                <h3>{game.teams[0].image}{game.teams[0].team_name} vs {game.teams[1].team_name}{game.teams[1].image}</h3>
            </CardHeader>
            <CardMeta>{game.location + " | " + game.stage.name}</CardMeta>
            {scoreEditable
            ?<CardContent>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    {game.teams[0].image}
                    <Input placeholder='0' fluid style={{minWidth: 50}}/>
                    vs
                    <Input placeholder='0' fluid style={{minWidth: 50}}/>
                    {game.teams[1].image}
                </div>
            </CardContent>
            :<CardDescription>{`${game.teams[0].image} ${game.game_scores[0].own_score ?? 0} - ${game.game_scores[1].own_score ?? 0} ${game.teams[1].image}`}</CardDescription>
            }
            
        </Card>
    )
}