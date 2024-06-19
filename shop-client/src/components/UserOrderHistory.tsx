import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import axios from 'axios';
import { Order } from './types/OrderType';
import Box from '@mui/material/Box';
import AuthService from './auth/AuthService';
import Grid from '@mui/material/Grid';
import { Card, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import HourglassBottomTwoToneIcon from '@mui/icons-material/HourglassBottomTwoTone';

function UserOrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const fetchUserOrders = async () => {
        const currentUser = AuthService.getCurrentUser();
        const userId = currentUser.id;

        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const response = await axios.get(`http://localhost:8080/getUserOrders/${userId}`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchUserTotalPrice = async () => {
        const currentUser = AuthService.getCurrentUser();
        const userId = currentUser.id;

        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const response = await axios.get(`http://localhost:8080/userTotalPrice/${userId}`, { headers });
            setTotalPrice(response.data);
        } catch (error) {
            console.error('Error fetching total price:', error);
        }
    };

    useEffect(() => {
        fetchUserOrders().then((data) => {
            setOrders(data);
        })
        fetchUserTotalPrice();
    }, []);
    useEffect(() => {
        if (orders.length > 0) {
            const total = orders.reduce((acc, order) => acc + order.price, 0);
            setTotalPrice(total);
        }
    }, [orders]);


    return (
        <Container maxWidth="lg">
            {AuthService.isUser() && (
                <Box>
                    <Grid container spacing={2} sx={{ mt: 5, mb: 5 }}>
                        {orders.map(order => (
                            <Grid item xs={12} key={order.id}>
                                <Card sx={{ display: 'flex', flexDirection: 'row', width: '100%' }} variant="outlined">
                                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <CardContent>
                                            <Typography variant="body1">Broj narudžbe: {order.id}</Typography>
                                            <Typography variant="h6">Datum narudžbe: {new Date(order.date).toLocaleDateString()}</Typography>
                                            <Typography variant="body1">Cijena: {order.price.toFixed(2)} €</Typography>
                                            <Typography variant="body1">Kupac: {order.customerName} {order.customerSurname}</Typography>
                                            <Typography variant="body1">Adresa: {order.customerAddress}</Typography>
                                        </CardContent>
                                        <CardContent>
                                            {order.finished ? (
                                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <CheckTwoToneIcon></CheckTwoToneIcon>
                                                    <Typography variant="body1">Uspješno završena narudzba!</Typography>
                                                </Box>
                                            ):(
                                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <HourglassBottomTwoToneIcon></HourglassBottomTwoToneIcon>
                                                    <Typography variant="body1">Narudžba u obradi!</Typography>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Card sx={{ display: 'flex', flexDirection: 'row', width: '100%' }} variant="outlined">
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <CardContent>
                                        <Typography variant="h6">Ukupno potrošeno: {totalPrice.toFixed(2)} €</Typography>
                                    </CardContent>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Container>
    );
}

export default UserOrderHistory;
