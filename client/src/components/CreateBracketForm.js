import React, {useContext, useState} from "react";
import { Form, FormInput, Segment, Button, FormGroup, Dropdown, ButtonGroup} from 'semantic-ui-react'
import { useFormik } from "formik";
import * as yup from "yup";
import TournamentContext from "../TournamentContextProvider";

export default function CreateBracketForm(){

    const [tournament, setTournament] = useContext(TournamentContext)
    const [isLoading, setIsLoading] = useState(false)

    const formSchema = yup.object().shape({
        numFields: yup.number().required()
            .typeError("Fields need to be a number!")
            .min(1, "You need at least 1 field to play a tournament."),
        numRounds: yup.number().required().min(1),
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
            startSuffix: "am",
            numRounds: 1,
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
            setIsLoading(true)
            console.log("sending request")
            const request_data = {
                type: "bracket",
                numFields: parseInt(values.numFields),
                numRounds: parseInt(values.numRounds),
                startHours: values.startSuffix === "pm" ? values.startHours + 12 : values.startHours,
                startMinutes: values.startMinutes,
                gameLength: parseInt(values.gameLength),
                breakLength: parseInt(values.breakLength),
                tournamentId: tournament.id
            }

            fetch("/api/accept_schedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request_data),
            }).then(res => res.json())
            .then(response => {
                setIsLoading(false)
                // formik.resetForm()
                //TODO: for this and pool form, prevent action if isLoading
                console.log(response)
                //go to next screen
            })
            .catch(e => console.log(e))
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

    const createBracketSizeOptions = () => {
        let options = []
        for(let i = 1; Math.pow(2, i) <= Object.keys(tournament.teams).length; i++){
            options.push({rounds: i, teams: Math.pow(2, i), })
        }
        return options
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
                        {createBracketSizeOptions().map(option => <Button
                            toggle active={formik.values.numRounds === option.rounds}
                            type="button" name="numRounds" value={option.rounds} key={option.rounds}
                            onClick={handleChange}
                            >
                            {option.rounds} round{option.rounds > 1 ? 's' : ''}
                            <br/>
                             {option.rounds > 1 ? `${option.teams} teams enter first round` : 'One final matchup'} 
                        </Button>
                        )}
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
            </Form>

        
           
            
        </Segment>
        
        
    )
}