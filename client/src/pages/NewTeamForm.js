import React from "react";
import { Label, Form, FormInput, FormRadio, Segment, Grid, Button } from 'semantic-ui-react'
import { useState } from 'react'

export default function NewTeamForm({}){

    const [formData, setFormData] = useState({
        name: "",
        image: ""
    })

    function handleChange(e, { name, value }){
        if (!(isEmoji(formData.image) && value.length > 2)){
            setFormData({...formData, [name]: value})
        }
    }

    function isEmoji(string) {
        const emojiRegex = /\p{Emoji}/u;

        if (emojiRegex.test(string)){
          return(true);
        }
      
        return(false);
    }

    return (
        <Segment color="blue" inverted tertiary>
            <h2>Create New Team</h2>
            <Form>
                <FormInput fluid style={{marginBottom: 20}} name="name"
                label='Team name' placeholder='Team name' value={formData.name} onChange={handleChange}/>
                
                <FormInput fluid name="image" style={{marginBottom: 20}} 
                label='Link to team photo' placeholder='Team photo' value={formData.image} onChange={handleChange}/>

                <Grid columns={2} style={{marginBottom:5}}>
                    <FormRadio
                    label='Use Emoji'
                    value='sm'
                    checked={isEmoji(formData.image)}
                    />
                    <FormRadio
                    label='Upload Photo'
                    value='photo'
                    checked={!isEmoji(formData.image)}
                    />
                </Grid>
                <Button>Submit</Button>
            </Form>
        </Segment>
        
    )
}