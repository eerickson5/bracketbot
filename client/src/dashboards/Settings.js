import React, {useState} from "react";
import { Button, Input } from 'semantic-ui-react'

export default function Settings(){
    const [wantToDelete, setWantToDelete] = useState(false)

    return(
        <div style={{display: 'flex', flexDirection: 'column', alignContent: 'flex-start'}}>
            {
                wantToDelete 
                ?   <>
                    <Button
                        color='blue'
                        content='Go Back'
                        icon='cancel'
                        onClick={() => setWantToDelete(false)}
                        style={{ alignSelf: 'flex-start', marginBottom: 10}}
                    />
                    <Input 
                        placeholder='Type tournament name to permanently delete it...' 
                        action={{
                            color: 'red',
                            labelPosition: 'right',
                            icon: 'trash',
                            content: 'Delete',
                        }}/>
                    </>
                :   <Button
                    color='red'
                    content='Delete Tournament'
                    icon='trash'
                    label={{ basic: true, color: 'red', pointing: 'left', content: 'This will delete all associated games.' }}
                    onClick={() => setWantToDelete(true)}
                />
            }
            
            
        </div>
        
    )
}