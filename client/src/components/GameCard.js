import React from "react";
import { Card } from 'semantic-ui-react'

export default function GameCard({game, color}){
    return (
        <Card
        fluid
        header= {`${game.teams[0].team_name} vs ${game.teams[1].team_name}`}
        description= {game.location + " | " + game.stage.name}
        meta= {`${game.teams[0].image} ${game.game_scores[0].own_score ?? 0} - ${game.game_scores[1].own_score ?? 0} ${game.teams[1].image}`}
        color={color}
        />
    )
}