import React from "react";
import { Label, LabelDetail, Icon } from 'semantic-ui-react'

export default function TeamCard({team, removeTeam}){

  return ( 
    <Label size="big" color="blue" as='a' onRemove={removeTeam}>
      {team.image}
      <LabelDetail>{team.name}</LabelDetail>
      <Icon name='delete' />
    </Label>
  )
}