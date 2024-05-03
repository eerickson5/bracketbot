import React, {useContext, useState} from "react";
import { Form, FormInput, FormRadio, Segment, Button, FormGroup, Dropdown, ButtonGroup} from 'semantic-ui-react'
import { useFormik } from "formik";
import * as yup from "yup";
import TempScheduleDisplay from "./TempScheduleDisplay";
import TournamentContext from "../TournamentContextProvider";

export default function CreateBracketForm(){

    const [tournament, setTournament] = useContext(TournamentContext)
    const [isLoading, setIsLoading] = useState(false)

    const formSchema = yup.object().shape({
        numFields: yup.number().required()
            .typeError("Fields need to be a number!")
            .min(1, "You need at least 1 field to play a tournament."),
        gameLength: yup.number().required()
            .typeError('Game length must be a number.')
            .min(10, "Games need to be longer than that."),
        breakLength: yup.number().required()
            .typeError('Break length must be a number')
            .min(0, "You need breaks!"),
        startHours: yup.number().oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).required(),
        startMinutes: yup.number().oneOf([0, 15, 30, 45]).required(),
        startSuffix: yup.string().oneOf(["am", "pm"]).required()
    })

    const getHours = () => {
        const hourOptions = Array.from({ length: 12 }, (_, index) => index + 1).map(int => {
            return {
                key: int.toString(),
                text: int < 10 ? `0${int.toString()}` : int.toString(),
                value: int
            }
        })
        return hourOptions
    }

    const getMinutes = () => {
        const minutesOptions = Array.from({ length: 4 }, (_, index) => index * 15).map(int => {
            return {
                key: int < 10 ? `0${int.toString()}` : int.toString(),
                text: int < 10 ? `0${int.toString()}` : int.toString(),
                value: int
            }
        })
        return minutesOptions
    }
    

    const formik = useFormik({
        initialValues: {
            numFields: 1,
            gameLength: 60,
            breakLength: 15, 
            startHours: 7,
            startMinutes: 0,
            startSuffix: "am"
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
            
        }
    })

    const renderErrors = () => {
        const errorMessages = Object.values(formik.errors);
        if (errorMessages.length === 0) {
          return null;
        }
        return (
          <p style={{color: 'red'}}>{errorMessages[0]}</p>
        );
    };

    function handleChange(e, { name, value }){
        formik.setFieldValue(name, value)
    }

    const createSizeOptions = () => {
        let options = []
        for(let i = 0; 2^i < Object.keys(tournament.teams).length; i++){

        }
    }

//TODO: add names/ids to form fields
    return (
        <Segment color="red" padded style={{marginBottom: 20, marginTop: 50}}>

            <h3>You're creating the bracket schedule using the {Object.keys(tournament.teams).length} teams in your tournament. <br/>Bracket matchups are determined by performance in pool play.</h3>
            <Form onSubmit={formik.handleSubmit} loading={isLoading}>
                <FormGroup inline>
                    <FormInput fluid style={{marginBottom: 20, maxWidth: 100}} name="numFields" size="large"
                    label='How many fields do you have access to?' placeholder='6' value={formik.values.numFields} onChange={handleChange}/>
                </FormGroup>


                <h5 style={{marginBottom: 10}}>How many rounds is bracket play?</h5>
                <FormGroup inline>
                    <ButtonGroup>
                        {/* {--.map()} */}
                        <Button>One</Button>
                        <Button>Two</Button>
                        <Button>Three</Button>
                    </ButtonGroup>
                </FormGroup>

                <FormGroup inline style={{marginTop: 20}}>
                    <FormInput fluid style={{marginBottom: 20, maxWidth: 100}} name="gameLength" size="large"
                    label='How long is each game? (minutes)' placeholder='60' value={formik.values.gameLength} onChange={handleChange}/>
                    <FormInput fluid style={{marginBottom: 20, maxWidth: 100}} name="breakLength" size="large"
                    label='How long are breaks between games? (minutes)' placeholder='15' value={formik.values.breakLength} onChange={handleChange}/>
                </FormGroup>

                <h5 style={{marginBottom: 10}}>When should the bracket start?</h5>
                <div style={{display: "flex", flexDirection: 'row', alignContent: 'center', marginBottom: 20}}>
                    <Dropdown placeholder='0' selection compact name="startHours"
                    value={formik.values.startHours} onChange={handleChange} options={getHours()}/>
                    <h2 style={{marginInline: 20}}>:</h2>
                    <Dropdown placeholder='00' selection compact name="startMinutes"
                     options={getMinutes()} />
                    <Dropdown placeholder='am' selection compact value={formik.values.startSuffix} onChange={handleChange} name="startSuffix"
                    options={[
                        {
                            key: "am",
                            text: "am",
                            value: "am"
                        }, {
                            key: "pm",
                            text: "pm",
                            value: "pm"
                        }
                    ]} />
                </div>



                {renderErrors()}
                
            </Form>

        
            <Button
            style={{marginBlock: 10}}
            content='Accept Settings and Generate Bracket'
            type="submit" name="submit"
            primary
            icon='checkmark' 
            labelPosition='left'
            label={{ basic: true, content: "You won't be able to modify the bracket beyond this point." }}
            // labelPosition='right'
            />
            
        </Segment>
        
        
    )
}