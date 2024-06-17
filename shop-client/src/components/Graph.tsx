import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import axios from 'axios';
import Box from '@mui/material/Box';
import AuthService from './auth/AuthService';
import Typography from '@mui/material/Typography';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Order } from "./types/OrderType";

interface AggregatedData {
    month: string;
    orderCount: number;
    totalSalesPrice: number;
}

const Graph: React.FC = () => {
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
                            <Bar dataKey="orderCount" fill="#8884d8" name="Broj narudžbi po mjesecima" />
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
            )}
        </Container>
    );
};

export default Graph;
