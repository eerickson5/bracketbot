import React from "react";
import { Form, FormInput, FormRadio, Segment, Grid, Button, Container } from 'semantic-ui-react'
import { useState } from 'react'
import TeamAdder from "../components/TeamAdder";
import { isSingleEmoji, randomEmoji } from "../emojiFunctions";
import { useFormik } from "formik";
import * as yup from "yup";

export default function NewTournamentForm(){


        //TODO: return button should trigger add team sometimes, not submit tournament
    const formSchema = yup.object().shape({
        tournamentName: yup.string().required("This tournament needs a name!").max(50),
        image: yup.string().max(150),
        teams: yup.array()
        // .of(
        // yup.object({
        //     name: yup.string().max(100),
        //     image: yup.string().max(5)
        // })
        // )
        .min(4).required()
    })

    const formik = useFormik({
        initialValues: {
            tournamentName: "",
            image: "",
            teams: []
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
            // if(e.target.name === "final-submit"){
                console.log("submitting...")
                if(values.image === ""){
                    values.image = randomEmoji()
                }
                values.image = values.image === "" ? randomEmoji() : values.image;
                console.log(values)
                fetch("http://localhost:5555/tournament", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
                }).then((r) => {r.json()})
                .then(item => {
                    console.log(item)
                    
                })
                .catch(e => setErrorMessage(e))
            // }
        }
    })

    const [errorMessage, setErrorMessage] = useState("")

    //TODO: this works for both inputs not just image WHAT
    function handleChange(e, { name, value }){
        if(name === "image"){
            if (!(isSingleEmoji(formik.values.image) && value.length > 2)){
                formik.setFieldValue(name, value)
            }
        } else {
            formik.setFieldValue(name, value)
        }
        
    }

    return (
        <Container style={{marginTop: 50}}>
            <Segment color="red" padded >
                <h2>Create New Tournament</h2>
                <Form onSubmit={formik.handleSubmit}>
                    <FormInput fluid style={{marginBottom: 20}} name="tournamentName" size="large"
                    label='Tournament name' placeholder='Tournament name' value={formik.values.tournamentName} onChange={handleChange}/>
                    
                    <FormInput fluid name="image" style={{marginBottom: 20}} size="large"
                    label='Tournament icon' placeholder='Tournament icon' value={formik.values.image} onChange={handleChange}/>

                    <Grid columns={2} style={{marginBottom:5}}>
                        <FormRadio
                        label='Use Emoji'
                        value='sm'
                        checked={isSingleEmoji(formik.values.image)}
                        onClick={() => formik.setFieldValue("image", "")}
                        />
                        <FormRadio
                        label='Link to Photo'
                        value='photo'
                        checked={!isSingleEmoji(formik.values.image)}
                        />
                    </Grid>
                    <p style={{color:'red'}}>{`${formik.errors.name} ${formik.errors.image}`}</p>
                    <h3>Add Teams</h3>
                    <TeamAdder teams={formik.values.teams} onEditTeams={(teams) => formik.setFieldValue("teams", teams)}/>
                    <Button type="submit" name="submit" >Submit</Button>
                </Form>
            </Segment>
        </Container>
        
        
    )
}