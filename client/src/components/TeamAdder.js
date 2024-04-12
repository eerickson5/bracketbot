import React from "react";
import { Form, FormInput, FormRadio, Segment, Grid, Button, Container } from 'semantic-ui-react'
import { useState } from 'react'
import TeamCard from "./TeamCard";

export default function TeamAdder({teams, addTeam}){
    teams = teams.map( team => TeamCard(team))
    return(
        {teams}
    )
}