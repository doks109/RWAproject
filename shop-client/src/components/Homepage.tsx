import React from 'react';
import './style/Homepage.css';
import Typography from "@mui/material/Typography";
import { Box } from '@mui/material';
import Front from "./style/front.jpg";
import Outside from "./style/outside.jpg";
import Gorenje from "./style/gorenje.jpeg";
import Samsung from "./style/samsung.png";
import Lg from "./style/lg.jpg";
import Toshiba from "./style/toshiba.png";
import Panasonic from "./style/panasonic.jpg";

import Slider from "./Slider";

const Images = [Gorenje, Samsung, Lg, Toshiba, Panasonic];

function Homepage(){
    return (
        <>
            <section className="jumbotron">
                <div className={"naslovni-tekst"} >
                    <Typography display={'block'} variant={'h4'} color='text.secondary'>
                        Pokvario Vam se hladnjak ili televizor?
                    </Typography>
                    <Typography display={'block'} variant={"h4"} color='text.secondary'>
                        Tražite novu perilicu za suđe?
                    </Typography>
                    <Typography display={'block'} variant='h2'>
                        Dobrodošli na pravo mjesto!
                    </Typography>
                    <Typography display={'block'} variant={'h1'}>
                        Shop d.o.o.
                    </Typography>
                    <Typography display={'block'} variant={'h4'} color='text.secondary'>
                        Pronađite savršen uređaj za sebe!
                    </Typography>
                </div>
                <Box component="img" alt="Naslovna slika." src={Front} />
            </section>

            <section className="about">
                <Box component="img" alt="Slika iz daljine." src={Outside}/>
                <div className={"about-tekst"}>
                    <Typography display={'block'} variant={'h2'}>
                        O nama
                    </Typography>
                    <Typography display={'block'} variant={'h5'}>
                        Nalazimo se u Buzetu na adresi Sportska ulica 89.
                    </Typography>
                </div>
            </section>

            <section className="marke">
                <div className="marke-tekst">
                    <Typography variant='h4'>
                        Zastupljene robne marke
                    </Typography>
                </div>
                <div className="slider">
                    <Slider imageUrls={Images} />
                </div>
            </section>

            <section className="ponuda">
                <div className={"ponuda-tekst"}>
                    <Typography variant='h4'>
                        Ponuda
                    </Typography>
                </div>
            </section>
        </>
    );
}

export default Homepage;