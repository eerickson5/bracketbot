import React from "react";
import { Form, FormInput, FormRadio, Segment, Grid, Button, Container } from 'semantic-ui-react'
import { useState } from 'react'

export default function NewTeamForm(){

    const [formData, setFormData] = useState({
        teamName: "",
        image: ""
    })

    function handleChange(e, { name, value }){
        if (!(isEmoji(formData.image) && value.length > 2)){
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

    function handleSubmit(){
        fetch("/api/team", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        }).then((r) => {r.json()}).then(item => console.log(item))
    }

    return (
        <Container style={{marginTop: 50}}>
            <Segment color="blue" inverted tertiary >
                <h2>Create New Team</h2>
                <Form onSubmit={handleSubmit}>
                    <FormInput fluid style={{marginBottom: 20}} name="teamName"
                    label='Team name' placeholder='Team name' value={formData.teamName} onChange={handleChange}/>
                    
                    <FormInput fluid name="image" style={{marginBottom: 20}} 
                    label='Team icon' placeholder='Team icon' value={formData.image} onChange={handleChange}/>

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
                    <Button>Submit</Button>
                </Form>
            </Segment>
        </Container>
        
        
    )
}