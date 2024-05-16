import React from "react";
import { Menu, MenuItem, Icon } from 'semantic-ui-react'
import { useNavigate } from "react-router-dom";

export default function TournamentMenu({selectedMenu, onSelectMenu}){

  const navigate = useNavigate()

    return (
        <Menu icon='labeled' tabular>

          <MenuItem
            name='home'
            active={selectedMenu === "home"}
            onClick={() => onSelectMenu("home")}
          >
            <Icon name='clipboard list' />
            Home
          </MenuItem>

        <MenuItem
          name='pools'
          active={selectedMenu === "pools"}
          onClick={() => onSelectMenu("pools")}
        >
          <Icon name='table' />
          Pools
        </MenuItem>

        <MenuItem
          name='bracket'
          active={selectedMenu === "bracket"}
          onClick={() => onSelectMenu("bracket")}
        >
          <Icon name='sitemap' />
          Bracket
        </MenuItem>

        <MenuItem
          name='settings'
          active={selectedMenu === "settings"}
          onClick={() => onSelectMenu("settings")}
        >
          <Icon name='setting' />
          Settings
        </MenuItem>

        <MenuItem
          name='exit'
          onClick={() => navigate('/tournaments')}
        >
          <Icon name='close' />
          Exit
        </MenuItem>
      </Menu>
    )
}