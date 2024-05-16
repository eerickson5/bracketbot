import React from "react";
import { Image, Header } from 'semantic-ui-react'
import { isSingleEmoji } from "../emojiFunctions";

export default function DynamicImage({image, isFullWidth, maxWidth='100%', maxHeight='200px'}){
    const emojis = Array.from({ length: isFullWidth ? 15 : 30 }, (_, index) => index + 1);
    const randomPosition = (max) => Math.floor(Math.random() * max);
    const randomSize = () => Math.floor(Math.random() * 70) + 20;
    const randomRotation = () => Math.floor(Math.random() * 360);
    const randomOpacity = () => Math.random() * 0.2 + 0.6;

    return isSingleEmoji(image) 
    ? 
        <div style={{ position: 'relative', overflow:'hidden', width: maxWidth, height: maxHeight, backgroundColor: '#e8e8e8' }}>
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
    : isFullWidth 
    ? <img src={image} alt="Tournament Logo" style={{maxHeight: 250, width:"100%", objectFit:"cover"}} />
    : <Image src={image} alt="Tournament Logo" fluid rounded style={{maxWidth: 500}}/>
}