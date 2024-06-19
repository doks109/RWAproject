import React, {useCallback, useEffect, useState} from 'react';
import Container from '@mui/material/Container';
import axios from 'axios';
import { Post } from './types/PostType';
import Box from '@mui/material/Box';
import AuthService from './auth/AuthService';
import Grid from '@mui/material/Grid';
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    debounce,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    Fab,
    Stack
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import RemoveCircleOutlineTwoToneIcon from '@mui/icons-material/RemoveCircleOutlineTwoTone';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

function ShoppingCart() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);
    const [additionalInfoRequired, setAdditionalInfoRequired] = useState(false);

    const fetchUserPosts = async () => {
        const currentUser = AuthService.getCurrentUser();
        const userId = currentUser.id;

        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const response = await axios.get(`http://localhost:8080/userPosts/${userId}`, { headers });
            return response.data;
        } catch (error) {
            console.error('Greška kod dohvata:', error);
        }
    };
    const fetchUserTotalPrice = async ():Promise<number> => {
        const currentUser = AuthService.getCurrentUser();
        const userId = currentUser.id;

        try{
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const response = await axios.get(`http://localhost:8080/userTotalPrice/${userId}`, { headers });
            return (response.data);
        } catch (error){
            console.error("Greška kod dohvata:", error);
        }
        return 0;
    };

    const handleBuy = async (id: string, kolicina: number, cijena: number) => {
        const currentUser = AuthService.getCurrentUser();
        const userId = currentUser.id;

        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            const response = await axios.post(`http://localhost:8080/addItem/${id}/${kolicina}/${cijena}`, userId, { headers });

            if (response.status === 200) {
                navigate("/cart");
                const newPrice = await fetchUserTotalPrice();
                setTotalPrice(newPrice);

                setItemCounts(prevItemCounts => {
                    const newCounts = { ...prevItemCounts };
                    if (newCounts[id]) {
                        newCounts[id]++;
                    } else {
                        newCounts[id] = 1;
                    }
                    return newCounts;
                });
            } else {
                console.error('Unexpected status code:', response.status);
            }
        } catch (error) {
            console.error('Greška kod kupnje', error);
        }
    };

    const handleDelete = async (id: string, cijena: number) => {
        const currentUser = AuthService.getCurrentUser();
        const userId = currentUser.id;

        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            await axios.delete(`http://localhost:8080/deleteItem/${userId}/${id}/${cijena}`, { headers });
            navigate("/cart");

            const newPrice = await fetchUserTotalPrice();
            setTotalPrice(newPrice);

            setItemCounts(prevItemCounts => {
                const newCounts = { ...prevItemCounts };
                if (newCounts[id] && newCounts[id] > 0) {
                    newCounts[id]--;
                }
                return newCounts;
            });
        } catch (error) {
            console.error('Greška kod brisanja', error);
        }
    }
    const handleRefresh = ()=>{
        window.location.reload();
    }
    const handleClearCart = async () =>{
        const currentUser = AuthService.getCurrentUser();
        const userId = currentUser.id;

        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            await axios.delete(`http://localhost:8080/clearUserPosts/${userId}`, { headers });
            handleRefresh();
        } catch (error) {
            console.error('Greška kod dohvata:', error);
        }
    }

    const fetchUserData = async () => {
        const currentUser = AuthService.getCurrentUser();
        const userId = currentUser.id;

        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            const response = await axios.get(`http://localhost:8080/user/${userId}`, { headers });

            const userData = response.data;
            const isInfoRequired = !userData.name || !userData.surname || !userData.address;
            setAdditionalInfoRequired(isInfoRequired);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };


    useEffect(() => {
        fetchUserPosts().then((data) => {

            const uniquePosts = data.filter((post: Post, index: number, self: any) =>
                    index === self.findIndex((p: Post) => (
                        p._id === post._id
                    ))
            );

            setPosts(uniquePosts);

            fetchUserTotalPrice().then((data) => {
                setTotalPrice(data);
            })

            const itemCountsObj: Record<string, number> = {};
            data.forEach((post: Post) => {
                const itemId = post._id;
                if (itemCountsObj[itemId]) {
                    itemCountsObj[itemId]++;
                } else {
                    itemCountsObj[itemId] = 1;
                }
            });

            setItemCounts(itemCountsObj);
        });
        fetchUserData();
    }, []);
    function calculatePrice(cijena: number, popust: number){
        let newPrice;
        newPrice = (cijena) - (cijena * (popust/100));
        return newPrice;
    }

    const handleBuy2 = debounce(handleBuy, 300);
    const handleBuy3 = useCallback(handleBuy2, []);
    const handleDelete2 = debounce(handleDelete, 300);
    const handleDelete3 = useCallback(handleDelete2, []);

    const handlePurchase = async () => {
        const currentUser = AuthService.getCurrentUser();
        const userId = currentUser.id;

        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            await axios.post(`http://localhost:8080/placeOrder/${userId}`, userId,{ headers });
            handleRefresh();
        } catch (error) {
            console.error('Greška kod kupnje', error);
        }
    }

    const handleAddInfo = async () => {
        navigate("/addUserInfo")
    }

    const handleHistory = () =>{
        navigate("/history");
    }
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container maxWidth={"lg"}>
            {AuthService.isUser() &&
                <Box>
                    <Grid container spacing={2} sx={{ mt: 5, mb: 5}}>
                        <Card sx={{ ml: 2, width: '100%' }} variant="outlined">
                            <CardContent sx={{justifyContent: 'space-between', display: 'flex', flexDirection: 'row', mt: 1}}>
                                <Typography variant="h5">
                                    Ukupna cijena: {totalPrice.toFixed(2)} €
                                </Typography>
                                <Button onClick={() => handleRefresh()} variant="contained" startIcon={<RefreshIcon />} sx={{mr: 2}}>
                                    Osvježi
                                </Button>
                                <Button onClick={() => handleClearCart()} variant="contained" color={"secondary"} startIcon={<DeleteIcon />}>
                                    Obriši sve artikle
                                </Button>
                                {additionalInfoRequired ? (
                                    <Button onClick={() => handleAddInfo()} variant="contained">
                                        Kupi
                                    </Button>
                                ):(
                                    <Box>
                                        <Button onClick={() => handleClickOpen()} variant="contained">
                                            Kupi
                                        </Button>
                                        <Dialog open={open} onClose={handleClose}>
                                            <DialogTitle id="alert-dialog-title">{"Ažurirati podatke ?"}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    Želite li ažurirati osobne podatke prije kupnje?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => handlePurchase()} variant="contained">
                                                    Ne
                                                </Button>
                                                <Button onClick={() => handleAddInfo()} variant="contained">
                                                    Ažuriraj
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </Box>
                                )
                                }

                            </CardContent>
                        </Card>
                        {posts.map((post, index) => (
                            <Grid item xs={12} key={index}>
                                <Card sx={{ display: 'flex', flexDirection: 'row', width: '100%'}} variant="outlined">
                                    <CardMedia
                                        sx={{ width: '25%', aspectRatio: 11 / 8 }}
                                        image={post.putanjaSlike}
                                        title={post.ime}
                                    />
                                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <CardContent>
                                            <Typography variant="h5" gutterBottom>
                                                {post.ime}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                Kategorija: {post.kategorija}
                                            </Typography>
                                            {(post.popust > 0) ?
                                                <Typography variant="h6" gutterBottom>
                                                    Cijena: {calculatePrice(post.cijena, post.popust).toFixed(2)} €
                                                </Typography>
                                                :
                                                <Typography variant="h6" gutterBottom>
                                                    Cijena: {calculatePrice(post.cijena, post.popust).toFixed(2)} €
                                                </Typography>
                                            }
                                        </CardContent>
                                        <CardContent sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Stack direction="row" spacing={2}>
                                                <Typography variant="h6">
                                                    Broj komada: {itemCounts[post._id] || 0}
                                                </Typography>
                                                <Tooltip disableFocusListener title={"Ukloni artikl !"}>
                                                    <Fab size="small" color="secondary" aria-label="delete" onClick={() => handleDelete3(post._id, calculatePrice(post.cijena, post.popust))}>
                                                        <RemoveCircleOutlineTwoToneIcon />
                                                    </Fab>
                                                </Tooltip>
                                                <Tooltip disableFocusListener title={"Dodaj artikl !"}>
                                                    <Fab size="small" color="primary" aria-label="buy" onClick={() => handleBuy3(post._id, 1, calculatePrice(post.cijena, post.popust))}>
                                                        <AddCircleOutlineTwoToneIcon />
                                                    </Fab>
                                                </Tooltip>
                                            </Stack>
                                        </CardContent>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                        <Card sx={{ ml: 2, mt: 4, width: '100%' }} variant="outlined">
                            <CardContent sx={{ display: 'flex', flexDirection: 'row', mt: 1}}>
                                <Button onClick={() => handleHistory()} variant="contained">
                                    Povijest narudžbi
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Box>
            }
        </Container>
    );
}

export default ShoppingCart;