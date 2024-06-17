import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import axios from 'axios';
import { Order } from './types/OrderType';
import Box from '@mui/material/Box';
import AuthService from './auth/AuthService';
import Grid from '@mui/material/Grid';
import { Card, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";

function UserOrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [confirm, setConfirm] = useState(false);

    const fetchOrders = async () => {
        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const response = await axios.get(`http://localhost:8080/getAllOrders` , { headers });
            return response.data;
        } catch (error) {
            console.error('Greška kod brisanja:', error);
        }
    };

    useEffect(() => {
        fetchOrders().then((data) => {
            setOrders(data);
            setConfirm(false);
        })
    }, [confirm]);


    const handleConfirm = async (orderId: string) => {

        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            await axios.post(`http://localhost:8080/confirmOrder/${orderId}`, orderId,{ headers });
            setConfirm(true);
        } catch (error) {
            console.error('Greška kod potvrde', error);
        }
    }

    return (
        <Container maxWidth="lg">
            {AuthService.isAdmin() && (
                <Box>
                    <Grid container spacing={2} sx={{ mt: 5, mb: 5 }}>
                        {orders.map(order => (
                            <Grid item xs={12} key={order.id}>
                                <Card sx={{ display: 'flex', flexDirection: 'row', width: '100%' }} variant="outlined">
                                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <CardContent>
                                            <Typography variant="h6">Broj narudžbe: {order.id}</Typography>
                                            <Typography variant="body1">Datum: {new Date(order.date).toLocaleDateString()}</Typography>
                                            <Typography variant="body1">Cijena: {order.price} €</Typography>
                                            <Typography variant="body1">Ime i prezime kupca: <strong> {order.customerName} {order.customerSurname} </strong></Typography>
                                            <Typography variant="body1">Adresa kupca: <strong> {order.customerAddress} </strong></Typography>
                                        </CardContent>
                                        <CardContent>
                                            {order.finished ? (
                                                <Typography variant="h5">Završena narudzba!</Typography>
                                            ):(
                                                <Button variant={"contained"} onClick={() => handleConfirm(order.id)}>
                                                    Potvrdi narudžbu
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    );
}

export default UserOrderHistory;
