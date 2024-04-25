import React, {useState} from "react";
import { Form, FormInput, FormRadio, Segment, Button, FormGroup, Dropdown} from 'semantic-ui-react'
import { useFormik } from "formik";
import * as yup from "yup";
import ScheduleDisplay from "./ScheduleDisplay";

export default function CreatePoolsForm({tournament, teamArrays, onGoBack}){

    const [isLoading, setIsLoading] = useState(false)
    const [tempSchedule, setTempSchedule] = useState({timeslots: [], matchups: [[]]})

    const formSchema = yup.object().shape({
        numFields: yup.number().min(1, "You can't play on a tournament with no field!").required()
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

            fetch("http://localhost:5555/generate_schedule", {
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
                setTempSchedule(response)
                //go to next screen
            })
            .catch(e => console.log(e))
        }
    })

//TODO hookup buttons
    function handleChange(e, { name, value }){
        formik.setFieldValue(name, value)
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
    


    return (
        <Segment color="red" padded style={{marginBottom: 20, marginTop: 50}}>

            <h3>You're creating these pools using the {tournament.teams.length} teams and {teamArrays.length} pools in your tournament. <br/> Teams will have between {minGames} and {maxGames} games each.</h3>
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
                <h3>Temporary Schedule ...</h3>
                <ScheduleDisplay 
                matchups={tempSchedule.matchups} 
                timeslots={tempSchedule.timeslots}
                />
            </div>


        {/* TODO: show individual pool schedules as well or color based on pool
            align below button to the right
            save changes to DB
            add team names using a context provider for the entire team dashboard
        */}

            <div style={{marginBlock: 15, display: "flex", flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',}}>

                    <Button
                    style={{marginBlock: 10}}
                    content='Accept and Save Pool Play Schedule'
                    type="submit" name="submit"
                    primary
                    icon='download' 
                    labelPosition='left'
                    label={{ basic: true, content: "You won't be able to modify pool settings beyond this point." }}
                    // labelPosition='right'
                    />
            </div>
            
        </Segment>
        
        
    )
}