import React from "react";
import { Label, LabelDetail, Icon } from 'semantic-ui-react'

export default function TeamCard({team, onRemoveTeam}){

  return ( 
    <Label size="big" color="blue" as='a' onClick={ () => team.onRemoveTeam ?  onRemoveTeam(team) : null} style={{marginBottom: 5}}>
      {team.image}
      <LabelDetail>{team.team_name}</LabelDetail>
      {team.onRemoveTeam ? <Icon name='delete' /> : null}
    </Label>
  )
}