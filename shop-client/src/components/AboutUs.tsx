import React from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";
import Outside from "./style/outside.jpg";
import Cilj from "./style/cilj.jpg";
import Zaposlenici from "./style/zaposlenici.jpg";


function AboutUs(){
    return (
        <Container maxWidth="xl">
            <Box className="jumbotron">
                <Box className={"naslovni-tekst"}>
                    <Typography display={'block'} variant={'h2'}>
                        O nama
                    </Typography>
                    <Typography display={'block'} variant={'h5'}>
                        Naša tvrtka, Shop d.o.o., osnovana je s ciljem pružanja vrhunske usluge i kvalitetnih proizvoda našim kupcima već više od deset godina. Ovdje u Shop d.o.o., fokusirani smo na stvaranje pozitivnog iskustva kupovine za svakog našeg kupca.
                    </Typography>
                </Box>
                <Box component="img" alt="Slika iz daljine." src={Outside}/>
            </Box>
            <Box className="about">
                <Box component="img" alt="Slika iz daljine." src={Cilj}/>
                <Box className="about-tekst">
                    <Typography variant='h2'>
                        Naš cilj
                    </Typography>
                    <Typography display={'block'} variant={'h5'}>
                        Naša misija je pružiti širok spektar proizvoda i usluga koji zadovoljavaju različite potrebe i preferencije naših kupaca. Bez obzira jeste li u potrazi za elektronikom, bijelom tehnikom ili kućanskim aparatima možete računati na nas da ćemo vam pružiti kvalitetne proizvode po konkurentnim cijenama.
                    </Typography>
                </Box>
            </Box>
            <Box className="jumbotron">
                <Box className={"naslovni-tekst"}>
                    <Typography display={'block'} variant={'h2'}>
                        Naši zaposlenici
                    </Typography>
                    <Typography display={'block'} variant={'h5'}>
                        Naš tim zaposlenika, sastavljen od strastvenih pojedinaca, predanih svojem poslu, čini temelj našeg uspjeha. Međusobna podrška i suradnja osiguravaju da svaki dan donosimo najbolje moguće iskustvo našim kupcima.
                    </Typography>
                </Box>
                <Box component="img" alt="Slika iz daljine." src={Zaposlenici}/>
            </Box>
        </Container>
    );
}

export default AboutUs;