import React, { useState } from "react";
import { Button, Form, Input, Segment } from "semantic-ui-react";
import * as yup from 'yup'
import { useFormik } from "formik";

export default function LoginForm(){    
    const [honeyPot, activateHoneyPot] = useState(false)
    const [signingUp, setSigningUp] = useState(false)

    const formSchema = yup.object().shape({
        email: yup.string().email("Invalid email format").required("Input an email").max(100),
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
                if(signingUp){

                } else {
                    
                }
            }
        }
    })

    function handleChange(e, { name, value }){
        formik.setFieldValue(name, value)
    }

    const renderErrors = () => {
        const errorMessages = Object.values(formik.errors);
        if (errorMessages.length === 0) {
          return null;
        }
        return (
          <p style={{color: 'red'}}>{errorMessages[0]}</p>
        );
    };

    return(
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Segment color="red" style={{margin: 20, maxWidth: 400, alignSelf: 'center', paddingBottom: 80}}>
                <h1>{ signingUp ? "Sign up for Bracketbot" : 'Login to Bracketbot'}</h1>
                <h3>Manage tournament pools and brackets</h3>
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

                    {
                    //honeypot to deter bots
                    }
                    <Input
                    style={{maxWidth: 2}}
                    placeholder="age - don't fill this out"
                    name="age"
                    onChange={() => activateHoneyPot(true)}
                    transparent
                    />

                    {renderErrors()}

                    <div>
                        <Button 
                        type="button"
                        size="large"
                        floated="left"
                        style={{marginBlock: 10}}
                        onClick={() => setSigningUp(signingUp => !signingUp)}
                        >
                            { signingUp ? 'Log in' : 'Sign Up'}
                        </Button>

                        <Button 
                        type="submit" 
                        primary
                        size="large"
                        floated="right"
                        style={{marginBlock: 10}}
                        >
                            { signingUp ? 'Sign Up' : 'Login'}
                        </Button>
                    </div>
                    
                </Form>
            </Segment>
        </div>
        
    )
}