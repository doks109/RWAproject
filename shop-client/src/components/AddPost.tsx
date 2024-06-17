import React, { useState } from 'react';
import axios from 'axios';
import { Post } from './types/PostType';
import {useNavigate} from "react-router-dom";
import {Box, Button, CssBaseline, FormControl, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import AuthService from "./auth/AuthService";


function AddPost(){
    let navigate = useNavigate();
    const [formData, setFormData] = useState<Post>({
        _id: '',
        ime: '',
        kategorija: '',
        opis: '',
        cijena: 0,
        popust: 0,
        raspolozivo: 0,
        putanjaSlike: ''
    });


    const onSubmit = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        const { _id, ...postData } = formData;

        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            await axios.post("http://localhost:8080/addPost", postData, { headers });
            navigate("/ponuda");
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleClose = () =>{
        navigate("/ponuda");
    };

    return (
        <Container maxWidth="xs">
            <Grid container spacing={2} justifyContent="center">
                <CssBaseline />
                <Box
                    sx={{
                        mt: 20,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                <Typography variant="h5">Dodaj artikl</Typography>
                <form onSubmit={(e) => onSubmit(e)} >
                    <FormControl>
                        <br />
                        <TextField
                            type="text"
                            name="ime"
                            value={formData.ime}
                            onChange={handleChange}
                            label="Ime"
                            required
                        /><br />
                        <TextField
                            type="text"
                            name="kategorija"
                            value={formData.kategorija}
                            onChange={handleChange}
                            label="Kategorija"
                            required
                        /><br />
                        <TextField
                            multiline
                            name="opis"
                            value={formData.opis}
                            onChange={handleChange}
                            label="Opis"
                            required
                        /><br />
                        <TextField
                            type="number"
                            name="cijena"
                            value={formData.cijena}
                            onChange={handleChange}
                            label="Cijena"
                            required
                        /><br />
                        <TextField
                            type="number"
                            name="popust"
                            value={formData.popust}
                            onChange={handleChange}
                            label="Popust u %"
                            required
                        /><br />
                        <TextField
                            type="number"
                            name="raspolozivo"
                            value={formData.raspolozivo}
                            onChange={handleChange}
                            label="Raspolozivo komada"
                            required
                        /><br />
                        <TextField
                            type="text"
                            name="putanjaSlike"
                            value={formData.putanjaSlike}
                            onChange={handleChange}
                            label="Putanja slike"
                            required
                        /><br />
                        <Button type="submit" variant="contained" color="primary">Dodaj artikl</Button><br />
                        <Button onClick={handleClose} variant="contained" color="primary">Cancel</Button>
                    </FormControl>
                </form>
                </Box>
            </Grid>
        </Container>
    );
}

export default AddPost;