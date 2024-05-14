import React from "react";
import { Image, Header } from 'semantic-ui-react'
import { isSingleEmoji } from "../emojiFunctions";

export default function DynamicImage({image, isFullWidth}){
    const emojis = Array.from({ length: 15 }, (_, index) => index + 1);

    const randomPosition = (max) => Math.floor(Math.random() * max);
    const randomSize = () => Math.floor(Math.random() * 70) + 20;
    const randomRotation = () => Math.floor(Math.random() * 360);
    const randomOpacity = () => Math.random() * 0.2 + 0.6;

    return isSingleEmoji(image) 
    ? <Header size='huge'>
        <div style={{ position: 'relative', width: '100%', height: '200px' }}>
            {emojis.map((_, index) => (
                <span
                key={index}
                style={{
                    position: 'absolute',
                    top: `${randomPosition(200)}px`,
                    left: `${randomPosition(800)}px`,
                    fontSize: `${randomSize()}px`,
                    transform: `rotate(${randomRotation()}deg)`,
                    opacity: randomOpacity()
                }}
                >
                {image}
                </span>
            ))}
            </div>
        </Header> 
    : isFullWidth 
    ? <img src={image} alt="Tournament Logo" style={{maxHeight: 250, width:"100%", objectFit:"cover"}} />
    : <Image src={image} alt="Tournament Logo" fluid rounded style={{maxWidth: 500}}/>
}