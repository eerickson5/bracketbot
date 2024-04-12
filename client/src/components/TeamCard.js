import React from "react";
import { Label, LabelDetail, Icon } from 'semantic-ui-react'

export default function TeamCard({team, onRemoveTeam}){

  return ( 
    <Label size="big" color="blue" as='a' onClick={ () => onRemoveTeam(team)}>
      {team.image}
      <LabelDetail>{team.name}</LabelDetail>
      <Icon name='delete' />
    </Label>
  )
}