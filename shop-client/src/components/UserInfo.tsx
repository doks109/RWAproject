import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CssBaseline, FormControl, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import AuthService from './auth/AuthService';


function UserForm() {
    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        address: '',
    });

    const onSubmit = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        const currentUser = AuthService.getCurrentUser();
        const userId = currentUser.id;

        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`,
            };

            await axios.patch(`http://localhost:8080/userInfo/${userId}`, formData, { headers });
            await axios.post(`http://localhost:8080/placeOrder/${userId}`, userId,{ headers });
            navigate('/cart');
        } catch (error) {
            console.error('Greška kod dodavanja informacija:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleClose = () => {
        navigate('/cart');
    };

    return (
        <Container maxWidth="xs">
            <Grid container spacing={2} justifyContent="center">
                <CssBaseline />
                <Box
                    sx={{
                        mt: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h5">Update User Information</Typography>
                    <form onSubmit={onSubmit}>
                        <FormControl>
                            <br />
                            <TextField
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                label="Name"
                                required
                            /><br />
                            <TextField
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                label="Surname"
                                required
                            /><br />
                            <TextField
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                label="Address"
                                required
                            /><br />
                            <Button type="submit" variant="contained" color="primary">Submit</Button><br />
                            <Button onClick={handleClose} variant="contained" color="primary">Cancel</Button>
                        </FormControl>
                    </form>
                </Box>
            </Grid>
        </Container>
    );
};

export default UserForm;