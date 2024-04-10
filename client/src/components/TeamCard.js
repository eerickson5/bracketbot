import React from "react";
import { Label } from 'semantic-ui-react'

export default function TeamCard({team}){
    const imageProps = {
        avatar: true,
        spaced: 'right',
        src: team.image,
      }
    
      return <Label as='a' content={team.name} image={imageProps} size="big" color="blue"/>
}