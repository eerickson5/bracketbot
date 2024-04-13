import React from "react";
import { Form, FormInput, FormRadio, Segment, Grid, Button, Container } from 'semantic-ui-react'
import { useState } from 'react'
import TeamAdder from "../components/TeamAdder";

export default function NewTournamentForm(){

    const [formData, setFormData] = useState({
        tournamentName: "",
        image: "",
    })

    const [teams, setTeams] = useState([
        // {name: "Atlanta Soul", image: "😎"},
        // {name: "Magma", image: "🌋"},
        // {name: "Ozone", image: "🫧"},
        // {name: "M'Kay'", image: "🤯"},
        // {name: "Happy Hour", image: "🍻"},
        // {name: "Wreck", image: "🦖"},
    ])

    //TODO: this works for both inputs not just image WHAT
    function handleChange(e, { name, value }){
        if(name !== "tournamentName"){
            if (!(isEmoji(formData.image) && value.length > 2)){
                setFormData({...formData, [name]: value})
            }
        } else {
            setFormData({...formData, [name]: value})
        }
        
    }

    function isEmoji(string) {
        const emojiRegex = /\p{Extended_Pictographic}/u;

        if (emojiRegex.test(string) || string.length === 0){
          return(true);
        }
      
        return(false);
    }

    //TODO: return button should trigger add team sometimes, not submit tournament
    function handleSubmit(e){
        e.preventDefault()
        if(e.target.name === "final-submit"){
            fetch("http://localhost:5555/tournament", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            }).then((r) => {r.json()}).then(item => console.log(item))
        }
        
    }

    return (
        <Container style={{marginTop: 50}}>
            <Segment color="red" padded onSubmit={handleSubmit}>
                <h2>Create New Tournament</h2>
                <Form>
                    <FormInput fluid style={{marginBottom: 20}} name="tournamentName" size="large"
                    label='Tournament name' placeholder='Tournament name' value={formData.tournamentName} onChange={handleChange}/>
                    
                    <FormInput fluid name="image" style={{marginBottom: 20}} size="large"
                    label='Tournament icon' placeholder='Tournament icon' value={formData.image} onChange={handleChange}/>

                    <Grid columns={2} style={{marginBottom:5}}>
                        <FormRadio
                        label='Use Emoji'
                        value='sm'
                        checked={isEmoji(formData.image)}
                        onClick={() => setFormData({...formData, image: ""})}
                        />
                        <FormRadio
                        label='Link to Photo'
                        value='photo'
                        checked={!isEmoji(formData.image)}
                        />
                    </Grid>

                    <h3>Add Teams</h3>
                    <TeamAdder teams={teams} onEditTeams={(teams) => setTeams(teams)}/>
                    <Button name="final-submit">Submit</Button>
                </Form>
            </Segment>
        </Container>
        
        
    )
}