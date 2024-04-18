import React from "react";
import { Form, FormInput, FormRadio, Segment, Button, FormGroup,} from 'semantic-ui-react'
import { useFormik } from "formik";
import * as yup from "yup";

export default function CreatePoolsForm({tournament}){

    const formSchema = yup.object().shape({
        numFields: yup.number().min(1, "You can't play on a tournament with no field!").required()
    })

    const formik = useFormik({
        initialValues: {
            numFields: 1,
            gameLength: 60,
            breakLength: 15,
            minGames: 2,
            maxGames: 4,
            crossoverAllowed: true
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
            console.log("submitted")
        }
    })


    function handleChange(e, { name, value }){
        formik.setFieldValue(name, value)
    }

    return (
        <Segment color="red" padded style={{marginBottom: 20, marginTop: 50}}>
            <h2>Create Tournament Pools</h2>

            <h3>{`You're creating these pools using the ${tournament.teams.length} teams in your tournament.`}</h3>
            <Form onSubmit={formik.handleSubmit}>
                <FormInput fluid style={{marginBottom: 20}} name="numFields" size="large"
                label='How many fields do you have access to?' placeholder='6' value={formik.values.numFields} onChange={handleChange}/>
                
                <h5 style={{marginBottom: 10}}>How many games should each team play in pool play?</h5>
                <FormGroup inline>
                    <FormInput fluid style={{marginBottom: 20}} name="maxGames" size="large"
                    label='Minimum' placeholder='2' value={formik.values.minGames} onChange={handleChange}/>
                    <FormInput fluid style={{marginBottom: 20}} name="minGames" size="large"
                    label='Maximum' placeholder='8' value={formik.values.maxGames} onChange={handleChange}/>
                </FormGroup>

                <h5 style={{marginBottom: 10}}>How long are games and breaks between games?</h5>
                <FormGroup inline>
                    <FormInput fluid style={{marginBottom: 20}} name="gameLength" size="large"
                    label='Game Length (minutes)' placeholder='60' value={formik.values.gameLength} onChange={handleChange}/>
                    <FormInput fluid style={{marginBottom: 20}} name="breakLength" size="large"
                    label='Break Length (minutes)' placeholder='15' value={formik.values.breakLength} onChange={handleChange}/>
                </FormGroup>

                <h5 style={{marginBottom: 10}}>Are crossover games allowed?</h5>
                <FormGroup inline>
                    <FormRadio
                    label='Yes'
                    value='yesCrossover'
                    checked={formik.values.crossoverAllowed}
                    onChange={(e) => handleChange(e, {name: "crossoverAllowed", value: true})}
                    />
                    <FormRadio
                    label='No'
                    value='noCrossover'
                    checked={!formik.values.crossoverAllowed}
                    onChange={(e) => handleChange(e, {name: "crossoverAllowed", value: false})}
                    />
                </FormGroup>

                <h3>There will be X pools with X games each, including X crossover game. <br/> It will last X hours and X minutes.</h3>

                
                <Button primary type="submit" name="submit" >Submit</Button>
            </Form>
        </Segment>
        
        
    )
}