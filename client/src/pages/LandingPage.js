import React from "react";
import LoginForm from "../dashboards/LoginForm";
import { Container } from "semantic-ui-react";

export default function LandingPage(){
    return(
        <div>
            <div style={{display: 'flex', flexDirection:'row'}}>
                <div>
                    <h2>Build tournament schedules from the first round ➜ finals</h2>
                    <h4>Add teams, plan pools, schedule games, and build brackets in seconds</h4>
                </div>
            </div>
            
            
             <LoginForm/>
        </div>
       
    )
}