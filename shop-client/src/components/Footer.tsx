import React from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

export default function Footer() {
    const year = new Date().getFullYear();

    return <footer>
        <Box px={{xs:1, sm:4}} py={{xs:1, sm:3}} bgcolor="#2196f3" color="white" position="relative" bottom="0" width="100%">
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Link href="" color="inherit">
                            </Link>
                        </Box>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Link href="" color="inherit">
                            </Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Link href="" color="inherit">
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
                <Box textAlign="center">
                    Shop by Dominik <br />
                    Copyright © | Dominik Krušvar {year}
                </Box>
            </Container>
        </Box>
    </footer>
};