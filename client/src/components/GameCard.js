import React from "react";
import { Card } from 'semantic-ui-react'

//game.game_score.own_score
//game.stage.name
export default function GameCard({game, color}){
    return (
        <Card
        fluid
        header= {`${game.teams[0].team_name} vs ${game.teams[1].team_name}`}
        description= {game.stage.name + " | " + game.location}
        meta= {`${game.teams[0].image} ${game.game_scores[0].own_score ?? 0} - ${game.game_scores[1].own_score ?? 0} ${game.teams[1].image}`}
        color={color}
        />
    )
}