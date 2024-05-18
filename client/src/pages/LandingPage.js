import React from "react";
import LoginForm from "../dashboards/LoginForm";
import { Button, Image } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage(){
    const navigate = useNavigate()
    return(
        <div>
            <div style={{backgroundColor: '#f5f5f5'}}>
                <Image src='https://i.imgur.com/56YwqBA.png' size="small"/>
            </div>
            
            <div style={{display: 'flex', flexWrap:'wrap', flexDirection:'row', padding: 20, alignItems: 'center', justifyContent: 'space-evenly'}}>
                <div>
                    <h1>Build tournament schedules <br/>from the first round ➜ finals</h1>
                    <h4>Add teams, plan pools, schedule games, and build brackets in seconds</h4>
                    <div style={{display: 'flex', flexDirection:'row', justifyContent: 'center'}}>
                        <Button content="Try it" icon='user' color='blue' onClick={() => navigate('/login')}/>
                        <a href="https://github.com/eerickson5/bracketbot">
                            <Button content="GitHub" icon='github' basic color='blue'/>
                        </a>
                        
                    </div>
                </div>
                <Image src='https://i.imgur.com/C8qi8ro.png' rounded bordered size="large" style={{marginBlock: 10}}/>
                
            </div>
            
            
             {/* <LoginForm/> */}
        </div>
       
    )
}