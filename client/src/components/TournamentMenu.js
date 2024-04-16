import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Icon } from 'semantic-ui-react'

export default function TournamentMenu({selectedMenu, onSelectMenu}){
    return (
        <Menu icon='labeled' tabular>

          <MenuItem
            name='home'
            active={selectedMenu === "home"}
            onClick={() => onSelectMenu("home")}
          >
            <Icon name='users' />
            Home
          </MenuItem>
        <MenuItem
          name='teams'
          active={selectedMenu === "teams"}
          onClick={() => onSelectMenu("teams")}
        >
          <Icon name='users' />
          Edit Teams
        </MenuItem>

        <MenuItem
          name='pools'
          active={selectedMenu === "pools"}
          onClick={() => onSelectMenu("pools")}
        >
          <Icon name='table' />
          Add Pools
        </MenuItem>

        <MenuItem
          name='bracket'
          active={selectedMenu === "bracket"}
          onClick={() => onSelectMenu("bracket")}
        >
          <Icon name='sitemap' />
          Add Bracket
        </MenuItem>

        <MenuItem
          name='settings'
          active={selectedMenu === "settings"}
          onClick={() => onSelectMenu("settings")}
        >
          <Icon name='setting' />
          Settings
        </MenuItem>
      </Menu>
    )
}