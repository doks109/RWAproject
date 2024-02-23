import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Post } from './types/PostType';
import {useNavigate} from "react-router-dom";
import {Alert, Button, Checkbox, FormControl, FormControlLabel, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";


function AddPost(){
    let navigate = useNavigate();
    const [formData, setFormData] = useState<Post>({
        _id: '',
        ime: '',
        kategorija: '',
        opis: '',
        cijena: 0,
        raspolozivo: false,
        putanjaSlike: ''
    });

    const onSubmit = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        const { _id, ...postData } = formData;

        try {
            await axios.post("http://localhost:8080/addPost", postData);
            navigate("/ponuda");
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isChecked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prevState => ({
            ...prevState,
            [name]: isChecked
        }));
    };

    return (
        <Container maxWidth="lg">
            <Grid container justifyContent="center">
                <form onSubmit={(e) => onSubmit(e)} >
                    <FormControl>
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
                        <FormControlLabel control={<Checkbox name="raspolozivo" checked={formData.raspolozivo} onChange={handleChange}/>} label={"Raspolozivo"}/><br />
                        <TextField
                            type="text"
                            name="putanjaSlike"
                            value={formData.putanjaSlike}
                            onChange={handleChange}
                            label="Putanja slike"
                            required
                        /><br />
                        <Button type="submit" variant="contained" color="primary">Dodaj artikl</Button>
                    </FormControl>
                </form>
            </Grid>
        </Container>
    );
}

export default AddPost;