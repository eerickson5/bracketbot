import React from "react";
import LoginForm from "../dashboards/LoginForm";
import { Image } from "semantic-ui-react";

export default function LandingPage(){
    return(
        <div>
            <div>
                <Image src='https://i.imgur.com/56YwqBA.png' size="tiny"/>
            </div>
            
            <div style={{display: 'flex', flexDirection:'row', padding: 20, alignItems: 'center', justifyContent: 'space-evenly'}}>
                <div>
                    <h2>Build tournament schedules from the first round ➜ finals</h2>
                    <h4>Add teams, plan pools, schedule games, and build brackets in seconds</h4>
                </div>
                <Image src='https://i.imgur.com/C8qi8ro.png' fluid rounded bordered size="large"/>
                
            </div>
            
            
             <LoginForm/>
        </div>
       
    )
}