import React from "react";
import { Button, Form, Input, Segment } from "semantic-ui-react";
import * as yup from 'yup'
import { useFormik } from "formik";

export default function LoginForm(){    
    const formSchema = yup.object().shape({
        email: yup.string().required("Input an email").max(100),
        password: yup.string().max(50),
    })

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {

        }
    })

    function handleChange(e, { name, value }){
        formik.setFieldValue(name, value)
    }

    return(
        <div>
            <Segment color="red" style={{margin: 20, maxWidth: 700, alignSelf: 'center', paddingBottom: 80}}>
                <h1>Login to Bracketbot</h1>
                <Form>
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

                    <Button 
                    type="submit" 
                    primary
                    size="large"
                    floated="right"
                    style={{marginBlock: 10}}
                    >
                        Login
                    </Button>
                </Form>
            </Segment>
        </div>
        
    )
}