import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image } from "semantic-ui-react";
export default function ErrorPage(){
    const navigate = useNavigate()
    return(
        <div style={{padding: 30}}>
            <Image src='https://lh3.googleusercontent.com/pw/AP1GczM3USD5Dql6O5olke1c7qClcHhRMb3dCSOfGZ_oth6MMt6XCJNSEfL7MrdDNaedxIBPOvNS78i-pJ7TBN9GN1e8AQem1-Aw3Z-LPFFbxGCrgyoWXmY=w2400' alt="bracketbot logo" size="small"/>
            <h1>404 Page Not Found</h1>
            <h3>Hi, there.  You seem to be lost.  <br/>That's okay.  We all get lost sometimes.</h3>
            <Button content="Get Unlost" onClick={() => navigate("/")}/>
        </div>
    )
}