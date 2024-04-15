import React from "react";
import { Image, Header } from 'semantic-ui-react'
import { isSingleEmoji } from "../emojiFunctions";

export default function DynamicImage({image, isFullWidth}){
    return isSingleEmoji(image) 
    ? <Header size='huge'>{image}{image}{image}</Header> 
    : isFullWidth 
    ? <img src={image} alt="Tournament Logo" style={{maxHeight: 250, width:"100%", objectFit:"cover"}} />
    : <Image src={image} fluid rounded style={{maxWidth: 500}}/>
}