import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Icon } from 'semantic-ui-react'

export default function TournamentMenu(tournamentId){
  const navigate = useNavigate()
    return (
        <Menu icon='labeled' secondary as="a">
        <MenuItem
          name='teams'
          // onClick={() => navigate(`/tournament/${tournamentId}/teams`)}
        >
          <Icon name='users' />
          Edit Teams
        </MenuItem>

        <MenuItem
          name='video camera'
        >
          <Icon name='table' />
          Add Pools
        </MenuItem>

        <MenuItem
          name='video play'
        >
          <Icon name='sitemap' />
          Add Bracket
        </MenuItem>

        <MenuItem
          name='settings'
        >
          <Icon name='setting' />
          Settings
        </MenuItem>
      </Menu>
    )
}