import React from "react";
import { Card } from 'semantic-ui-react'

export default function GameCard({game}){
    return (
        <Card
        header= {`${game.game_scores[0].team.name} vs ${game.game_scores[1].team.name}`}
        description= {game.stage.name + " | " + game.location}
        meta= {`${game.game_scores[0].team.name} ${game.game_scores[0].own_score} - ${game.game_scores[1].own_score} ${game.game_scores[1].team.name}`}
        color="orange"
        />
    )
}