import React, {useContext, useState} from "react";
import { Form, FormInput, FormRadio, Segment, Button, FormGroup, Dropdown} from 'semantic-ui-react'
import { useFormik } from "formik";
import * as yup from "yup";
import TempScheduleDisplay from "./TempScheduleDisplay";
import TournamentContext from "../TournamentContextProvider";

export default function CreatePoolsForm({teamArrays, onGoBack}){

    const [tournament, setTournament] = useContext(TournamentContext)
    const [isLoading, setIsLoading] = useState(false)
    const [tempSchedule, setTempSchedule] = useState({timeslots: [], matchups: [[]]})
    const [teamPools, setTeamPools] = useState({})

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
        crossoversAllowed: yup.boolean().required(), 
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
            crossoversAllowed: false, 
            startHours: 7,
            startMinutes: 0,
            startSuffix: "am"
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
            setIsLoading(true)
            const request_data = {
                type: "pool",
                team_lists: teamArrays,
                num_fields: parseInt(values.numFields),
                crossovers_allowed: values.crossoversAllowed,
                start_hours: values.startSuffix === "pm" ? values.startHours + 12 : values.startHours,
                start_minutes: values.startMinutes,
                game_length: parseInt(values.gameLength),
                break_length: parseInt(values.breakLength)
            }

            fetch("/api/generate_schedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request_data),
            }).then(res => res.json())
            .then(response => {
                setIsLoading(false)
                // formik.resetForm()
                console.log(response)
                setTempSchedule({matchups: response.matchups, timeslots: response.timeslots})
                setTeamPools(response.teamPools)
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

    function submitPoolSchedule(){
        const request_data = {
            type: "pool",
            timeslots: tempSchedule.timeslots,
            matchups: tempSchedule.matchups,
            tournamentId: tournament.id,
            teamPools: teamPools,
            numStages: teamArrays.length
        }
        fetch("/api/accept_schedule", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request_data),
        }).then(res => res.json())
        .then(response => {
            setTournament({...tournament, stages: response.stages})
        })
    }

    let largestPoolSize = 0
    let smallestPoolSize = 100
    for (const teamArray of teamArrays){
        const poolSize = teamArray.length
        if (poolSize > largestPoolSize){
            largestPoolSize = poolSize
        } 
        if (poolSize < smallestPoolSize) {
            smallestPoolSize = poolSize
        }
    }
    const maxGames = (largestPoolSize - 1 + (formik.values.crossoversAllowed ? 1 : 0))
    const minGames = (smallestPoolSize - 1 + (formik.values.crossoversAllowed ? 1 : 0))
    const alreadyGenerated = Boolean(tempSchedule.timeslots.length)

//TODO: add names/ids to form fields
    return (
        <Segment color="red" padded style={{marginBottom: 20, marginTop: 50}}>

            <h3>You're creating these pools using the {Object.keys(tournament.teams).length} teams and {teamArrays.length} pools in your tournament. <br/> Teams will have between {minGames} and {maxGames} games each.</h3>
            <Form onSubmit={formik.handleSubmit} loading={isLoading}>
                <FormInput fluid style={{marginBottom: 20, maxWidth: 100}} name="numFields" size="large"
                label='How many fields do you have access to?' placeholder='6' value={formik.values.numFields} onChange={handleChange}/>

                <FormGroup inline>
                    <FormInput fluid style={{marginBottom: 20, maxWidth: 100}} name="gameLength" size="large"
                    label='How long is each game? (minutes)' placeholder='60' value={formik.values.gameLength} onChange={handleChange}/>
                    <FormInput fluid style={{marginBottom: 20, maxWidth: 100}} name="breakLength" size="large"
                    label='How long are breaks between games? (minutes)' placeholder='15' value={formik.values.breakLength} onChange={handleChange}/>
                </FormGroup>

                <h5 style={{marginBottom: 10}}>When does the tournament start?</h5>
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

                <h5 style={{marginBottom: 10}}>Are crossover games allowed?</h5>
                <FormGroup inline>
                    <FormRadio
                    label='Yes'
                    value='yesCrossover'
                    checked={formik.values.crossoversAllowed}
                    onChange={(e) => handleChange(e, {name: "crossoversAllowed", value: true})}
                    disabled={teamArrays.length === 1}
                    />
                    <FormRadio
                    label='No'
                    value='noCrossover'
                    checked={!formik.values.crossoversAllowed}
                    onChange={(e) => handleChange(e, {name: "crossoversAllowed", value: false})}
                    />
                </FormGroup>

                {renderErrors()}

                <div style={{marginBlock: 15, display: "flex", flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',}}>
                    <Button 
                    style={{margin: 5}} 
                    content='Back to Pool Editor' 
                    icon='step backward' 
                    labelPosition='left'
                    type="button"
                    secondary 
                    onClick={onGoBack}
                    />

                    <Button
                    style={{marginBlock: 10}}
                    content='Generate Pool Schedule'
                    type="submit" name="submit"
                    primary
                    icon='wait' 
                    labelPosition='right'
                    />
                </div>
                
            </Form>

            <div style={{alignSelf: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <TempScheduleDisplay 
                matchups={tempSchedule.matchups} 
                timeslots={tempSchedule.timeslots}
                teamPools={teamPools}
                />
            </div>
        
            <Button
            style={{marginBlock: 10}}
            disabled={tempSchedule.timeslots.length === 0}
            content='Accept and Save Pool Play Schedule'
            type="submit" name="submit"
            primary
            icon='checkmark' 
            labelPosition='right'
            label={{ basic: true, content: "You won't be able to modify pool settings beyond this point." }}
            onClick={alreadyGenerated ? submitPoolSchedule : null}
            // labelPosition='right'
            />
            
        </Segment>
        
        
    )
}