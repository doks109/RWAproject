import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import axios from 'axios';
import Box from '@mui/material/Box';
import AuthService from './auth/AuthService';
import Grid from '@mui/material/Grid';
import {Card, CardContent, CardMedia, Typography} from '@mui/material';
import { Post } from "./types/PostType";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Order} from "./types/OrderType";

interface AggregatedData {
    month: string;
    orderCount: number;
    totalSalesPrice: number;
}

function AdminDash() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [mostSoldItem, setMostSoldItem] = useState<number>(0);

    const fetchMostSoldPost = async () => {
        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const response = await axios.get(`http://localhost:8080/mostSoldItems`, { headers });
            return response.data;
        } catch (error) {
            console.error('Greška kod dohvaćanja:', error);
            return {};
        }
    };
    const fetchMostSoldItemCount = async () => {
        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const response = await axios.get(`http://localhost:8080/mostSoldItemCount`, { headers });
            return response.data;
        } catch (error) {
            console.error('Greška kod dohvaćanja:', error);
        }
    };
    function calculatePrice(cijena: number, popust: number){
        let newPrice;
        newPrice = (cijena) - (cijena * (popust/100));
        return newPrice;
    }

    useEffect(() => {
        fetchMostSoldPost().then((data) => {
            setPosts(data);
        });
        fetchMostSoldItemCount().then((data) => {
            setMostSoldItem(data);
        });
    }, []);

    const [orders, setOrders] = useState<Order[]>([]);
    const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);

    const fetchOrders = async () => {
        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const response = await axios.get<Order[]>(`http://localhost:8080/getFinishedOrders`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    };

    useEffect(() => {
        fetchOrders().then((data) => {
            setOrders(data);
        });
    }, []);

    useEffect(() => {
        const groupDataByMonth = () => {
            const groupedData = orders.reduce<Record<string, { orderCount: number; totalSalesPrice: number }>>(
                (acc, order) => {
                    const month = new Date(order.date).toLocaleString('default', { month: 'long', year: 'numeric' });
                    if (!acc[month]) {
                        acc[month] = { orderCount: 0, totalSalesPrice: 0 };
                    }
                    acc[month].orderCount += 1;
                    acc[month].totalSalesPrice += order.price;
                    return acc;
                },
                {}
            );

            const aggregated = Object.entries(groupedData).map(([month, { orderCount, totalSalesPrice }]) => ({
                month,
                orderCount,
                totalSalesPrice,
            }));

            setAggregatedData(aggregated);
        };

        if (orders.length > 0) {
            groupDataByMonth();
        }
    }, [orders]);


    return (
        <Container maxWidth="lg">
            {AuthService.isAdmin() && (
                <Box sx={{mt: 5}}>
                    <Typography variant="h4" gutterBottom>
                        Najprodavaniji proizvod
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 5 }}>
                        {posts && posts.map((post, index) => (
                            <Grid item xs={12} key={index}>
                                <Card sx={{ display: 'flex', flexDirection: 'row', width: '100%' }} variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom>
                                            Broj prodanih: {mostSoldItem}
                                        </Typography>
                                    </CardContent>
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
                                    </Box>
                                    <CardMedia
                                        sx={{ width: '25%', aspectRatio: 11 / 8 }}
                                        image={post.putanjaSlike}
                                        title={post.ime}
                                    />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Broj narudžbi po mjesecima
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={aggregatedData}
                                margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="orderCount" fill="#8884d8" name="Broj narudžbi" />
                            </BarChart>
                        </ResponsiveContainer>

                        <Typography variant="h4" gutterBottom>
                            Mjesečni prihodi
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={aggregatedData}
                                margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="totalSalesPrice" fill="#82ca9d" name="Mjesečni prihod u €" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Box>

            )}
        </Container>

    );
}

export default AdminDash;
