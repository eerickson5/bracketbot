import React, { useState } from "react";
import { Button, Form, Input, Segment, Image } from "semantic-ui-react";
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";

export default function LoginForm(){    
    const [honeyPot, activateHoneyPot] = useState(false)
    const [isSigningUp, setSigningUp] = useState(false)
    const [requestErrorMessage, setRequestErrorMessage] = useState("")

    const navigate = useNavigate()

    const formSchema = yup.object().shape({
        email: yup.string().email("Invalid email format.").required("Input an email.").max(100),
        password: yup.string().max(50).min(8),
    })

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
            if(!honeyPot){
                setRequestErrorMessage("")
                const url = isSigningUp ? "/api/signup" : "/api/login"
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password
                    }),
                }).then(res => res.json())
                .then(response => {
                    if (response.message){
                        setRequestErrorMessage(response.message)
                    } else {
                        console.log(response)
                        navigate(`/tournaments`)
                    }
                    
                })
                .catch(e => setRequestErrorMessage(e.message))
            }
        }
    })

    function handleChange(e, { name, value }){
        setRequestErrorMessage("")
        formik.setFieldValue(name, value)
    }

    //TODO: forgot password emailer
    return(
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Segment color="blue" style={{margin: 20, minWidth: 300, alignSelf: 'center', paddingBottom: 80}}>
            <Image src='https://lh3.googleusercontent.com/pw/AP1GczM3USD5Dql6O5olke1c7qClcHhRMb3dCSOfGZ_oth6MMt6XCJNSEfL7MrdDNaedxIBPOvNS78i-pJ7TBN9GN1e8AQem1-Aw3Z-LPFFbxGCrgyoWXmY=w2400' size="small"/>
                <h1>{ isSigningUp ? "Sign Up" : 'Login'}</h1>
                <h4 
                style={{cursor: 'pointer', padding: '10px',}}
                onClick={() => setSigningUp(isSigningUp => !isSigningUp)}>{ 
                    isSigningUp 
                    ? ( <>Already have an account? <span style={{ color: 'blue' }}>Log in.</span></> )
                    : ( <>Don't have an account? <span style={{ color: 'blue' }}>Sign up!</span></> )
                }</h4>
                <Form onSubmit={formik.handleSubmit}>
                    <h4>Email</h4>
                    <Input
                    placeholder="email"
                    value={formik.values.email}
                    name="email"
                    onChange={handleChange}
                    fluid
                    />

                    <h4>Password</h4>
                    <Input
                    placeholder="password"
                    value={formik.values.password}
                    name="password"
                    onChange={handleChange}
                    fluid
                    />

                    {/* honeypot to deter bots */}
                    
                    <Input
                    style={{maxWidth: 2}}
                    placeholder="age - don't fill this out"
                    name="age"
                    onChange={() => activateHoneyPot(true)}
                    transparent
                    />

                    <p style={{color: 'red'}}>
                        {Object.values(formik.errors)[0]}<br/>{requestErrorMessage}
                    </p>
                        

                    <div>
                        <Button 
                        type="button"
                        size="large"
                        floated="left"
                        style={{marginBlock: 10}}
                        onClick={() => navigate('/')}
                        >
                            Back
                        </Button>

                        <Button 
                        type="submit" 
                        primary
                        size="large"
                        floated="right"
                        style={{marginBlock: 10}}
                        >
                            { isSigningUp ? 'Sign Up' : 'Login'}
                        </Button>
                    </div>
                </Form>
            </Segment>
        </div>
        
    )
}