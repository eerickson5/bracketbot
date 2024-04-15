import React from "react";
import { Image, Header } from 'semantic-ui-react'
import { isSingleEmoji } from "../emojiFunctions";

export default function DynamicImage({image}){
    return isSingleEmoji(image) ? <Header size='huge'>{image}{image}{image}</Header> : <Image src={image} fluid rounded style={{maxWidth: 500}}/>
}