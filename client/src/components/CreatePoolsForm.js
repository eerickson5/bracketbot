import React from "react";
import { Form, FormInput, FormRadio, Segment, Button, FormGroup,} from 'semantic-ui-react'
import { useFormik } from "formik";
import * as yup from "yup";

export default function CreatePoolsForm({tournament, teamArrays}){
    console.log(teamArrays)

    const formSchema = yup.object().shape({
        numFields: yup.number().min(1, "You can't play on a tournament with no field!").required()
    })

    const formik = useFormik({
        initialValues: {
            numFields: 1,
            gameLength: 60,
            breakLength: 15,
            crossoverAllowed: true
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
            console.log("submitted")
        }
    })

//TODO hookup buttons
    function handleChange(e, { name, value }){
        formik.setFieldValue(name, value)
    }

    return (
        <Segment color="red" padded style={{marginBottom: 20, marginTop: 50}}>

            <h3>{`You're creating these pools using the ${tournament.teams.length} teams and ${teamArrays.length} pools in your tournament.`}</h3>
            <Form onSubmit={formik.handleSubmit}>
                <FormInput fluid style={{marginBottom: 20}} name="numFields" size="large"
                label='How many fields do you have access to?' placeholder='6' value={formik.values.numFields} onChange={handleChange}/>

                <FormGroup inline>
                    <FormInput fluid style={{marginBottom: 20, maxWidth: 100}} name="gameLength" size="large"
                    label='How long is each game? (minutes)' placeholder='60' value={formik.values.gameLength} onChange={handleChange}/>
                    <FormInput fluid style={{marginBottom: 20, maxWidth: 100}} name="breakLength" size="large"
                    label='How long are breaks between games? (minutes)' placeholder='15' value={formik.values.breakLength} onChange={handleChange}/>
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

                <h3>There will be {teamArrays.length} pools with X games each, including X crossover game. <br/> It will last X hours and X minutes.</h3>

                <div style={{marginBlock: 15, display: "flex", flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',}}>
                    <Button style={{margin: 5}} content='Back to Pool Editor' icon='step backward' labelPosition='left' secondary />
                    <Button
                    style={{marginBlock: 10}}
                    content='Generate Pool Matchups'
                    type="submit" name="submit"
                    primary
                    label={{ basic: true, content: "You won't be able to modify teams or pools beyond this point." }}
                    labelPosition='right'
                    />
                </div>
                
            </Form>
        </Segment>
        
        
    )
}