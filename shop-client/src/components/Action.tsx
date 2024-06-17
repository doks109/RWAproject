import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { Post } from './types/PostType';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate} from "react-router-dom";
import {Card, CardMedia, debounce, Fab, Paper, Stack} from '@mui/material';
import Divider from "@mui/material/Divider";
import AuthService from "./auth/AuthService";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Tooltip from '@mui/material/Tooltip';


function Action() {
    const [posts, setPosts] = useState<Post[]>([]);
    const navigate = useNavigate();

    const fetchDiscount = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/discount`);
            return response.data;
        } catch (error) {
            console.error('Greška kod dohvata:', error);
        }
    };

    useEffect(() => {
        fetchDiscount().then((data) => {
            setPosts(data)
        });
    }, []);


    const handleBuy = async (id: string, kolicina: number, cijena: number) => {
        const currentUser = AuthService.getCurrentUser();
        const userId = currentUser.id;

        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            await axios.post(`http://localhost:8080/addItem/${id}/${kolicina}/${cijena}`, userId, {headers});
            navigate("/akcija");
        } catch (error) {
            console.error('Greška kod kupnje', error);
        }
    }
    const handleBuy2 = debounce(handleBuy, 300);
    const handleBuy3 = useCallback(handleBuy2, []);


    const handleLogin = async () => {
        navigate("/login");
    }


    function calculatePrice(cijena: number, popust: number){
        let newPrice;
        newPrice = (cijena) - (cijena * (popust/100));
        return newPrice;
    }

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2} sx={{ mt: 5, mb: 5}}>
                {posts.map((post, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper elevation={8}>
                        <Card variant="outlined" sx={{ width: "100%", maxWidth: 1200, aspectRatio: 8 / 13, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Box>
                                <Stack justifyContent="space-between" alignItems="center">
                                    <CardMedia
                                        sx={{ width: "100%", aspectRatio: 10 / 8 }}
                                        image={post.putanjaSlike}
                                        title={post.ime}
                                    />
                                </Stack>
                            </Box>
                            <Box>
                                <Stack justifyContent="space-between" alignItems="center">
                                    <Typography variant="h5" gutterBottom>
                                        {post.ime}
                                    </Typography>
                                </Stack>
                            </Box>
                            <Divider />
                            <Box>
                                <Stack justifyContent="space-between" alignItems="center">
                                    <Typography variant="body1" gutterBottom>
                                        Kategorija: {post.kategorija}
                                    </Typography>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6" gutterBottom>
                                            <strong>Cijena: {post.cijena} €</strong>
                                        </Typography>
                                        {(post.popust > 0) &&
                                            <Typography variant="h5" gutterBottom sx={{ml: 2}}>
                                                <strong>-</strong>{post.popust}%
                                            </Typography>
                                        }
                                    </Stack>
                                    {(post.popust > 0) &&
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="h6" color="primary" gutterBottom>
                                                Nova cijena: {calculatePrice(post.cijena, post.popust).toFixed(2)} €
                                            </Typography>
                                        </Stack>
                                    }
                                    <Typography variant="body1" gutterBottom>
                                        Raspoloživo: {post.raspolozivo ? 'Da' : 'Ne'}
                                    </Typography>
                                </Stack>
                            </Box>
                            <Divider />
                            <Box>
                                <Stack justifyContent="space-between" alignItems="left">
                                    <Typography variant="body1" gutterBottom color="text.secondary">
                                        Opis: {post.opis}
                                    </Typography>
                                </Stack>
                            </Box>

                            {AuthService.isUser() &&
                                <Box sx={{marginTop: "auto", mb: 1}}>
                                    <Stack direction="column" alignItems={"center"}>
                                        <Tooltip disableFocusListener title={"Dodaj u košaricu !"}>
                                            <Fab size="small" color="primary" aria-label="buy">
                                                {(post.popust > 0) ?
                                                    <ShoppingCartIcon onClick={() => handleBuy3(post._id, 1, calculatePrice(post.cijena, post.popust))} />
                                                    :
                                                    <ShoppingCartIcon onClick={() => handleBuy3(post._id, 1, post.cijena)} />
                                                }
                                            </Fab>
                                        </Tooltip>
                                    </Stack>
                                </Box>
                            }
                            {(!AuthService.isUser() && !AuthService.isAdmin()) &&
                                <Box sx={{marginTop: "auto"}}>
                                    <Stack justifyContent="space-between" alignItems="center">
                                        <Fab size="small" color="primary" aria-label="buy">
                                            <Tooltip disableFocusListener title={"Prijavi se ili registriraj !"}>
                                                <ShoppingCartIcon onClick={() => handleLogin()} />
                                            </Tooltip>
                                        </Fab>
                                        <Typography>
                                            Prijavi se ili registriraj za nastavak.
                                        </Typography>
                                    </Stack>
                                </Box>
                            }
                        </Card>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Action;
