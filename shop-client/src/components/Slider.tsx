import React, { useState } from 'react';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {ArrowBackIosNew} from "@mui/icons-material";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import "./style/img-slider.css";


type ImageSliderProps = {
    imageUrls: string[]
}

export default function Slider ({ imageUrls }: ImageSliderProps){
    const [imageIndex, setImageIndex] = useState(0);

    function showPrevImage(){
        setImageIndex(index => {
            if(index === 0) return imageUrls.length - 1;
            return index - 1;
        })
    }
    function showNextImage(){
        setImageIndex(index => {
            if(index === imageUrls.length - 1) return 0;
            return index + 1;
        })
    }

    return (
    <div style = {{ width: "100%", height: "100%", position: "relative"}}>
        <img src = {imageUrls[imageIndex]} className="img-slider-img"/>
        <button onClick={showPrevImage} className="img-slider-btn" style={{ left: 0}}>
            <ArrowBackIosNew />
        </button>
        <button onClick={showNextImage} className="img-slider-btn" style={{ right: 0}}>
            <ArrowForwardIosIcon />
        </button>
        <div style ={{ position: "absolute", bottom: ".5rem", left: "50%", translate: "-50%", display: "flex", gap: ".25rem"}}>
            {imageUrls.map((_ , index) => (
                <button key = {index} className = "img-slider-dot-btn"
                        onClick = {() => setImageIndex(index)}> {index === imageIndex ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />} </button>
                ))}
        </div>
    </div>
    )
}