import React from "react";
import { Label, Form, FormInput, FormRadio, Segment, Grid } from 'semantic-ui-react'
import { useState } from 'react'

export default function NewTeamForm({}){

    const [formData, setFormData] = useState({
        name: "",
        image: ""
    })

    function handleChange(e, { name, value }){
        setFormData({...formData, [name]: value})
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
            <Form>
                <FormInput fluid style={{marginBottom: 30}} name="name"
                label='Team name' placeholder='Team name' value={formData.name} onChange={handleChange}/>
                
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
                
                <FormInput fluid name="image" style={{marginBottom: 30}} 
                label='Link to team photo' placeholder='Team photo' value={formData.image} onChange={handleChange}/>
            </Form>
        </Segment>
        
    )
}