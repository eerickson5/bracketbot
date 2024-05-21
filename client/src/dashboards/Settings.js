import React, {useContext, useState} from "react";
import { Button, Input } from 'semantic-ui-react'
import TournamentContext from "../TournamentContextProvider";
import { useNavigate } from "react-router-dom";

export default function Settings(){
    const [wantToDelete, setWantToDelete] = useState(false)
    const [deletingInput, setDeletingInput] = useState("")
    const [tournament] = useContext(TournamentContext)
    const navigate = useNavigate()

    const handleDeleteTournament = () => {
        if(deletingInput === tournament.name)
            fetch(`/tournament/${tournament.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            }).then(res => res.json())
            .then(() => {
                navigate('/tournaments')
            })
            .catch(e => console.log(e))
        
    }

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
                            onClick:handleDeleteTournament
                        }}
                        value={deletingInput}
                        onChange={ e => setDeletingInput(e.target.value)}
                        />
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