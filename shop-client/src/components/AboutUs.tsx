import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Post } from './types/PostType';
import {useNavigate} from "react-router-dom";


function AboutUs(){
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
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div>
            <form onSubmit={(e) => onSubmit(e)} >
                <input type="text" name="ime" value={formData.ime} onChange={handleChange} placeholder="Ime" required /><br />
                <input type="text" name="kategorija" value={formData.kategorija} onChange={handleChange} placeholder="Kategorija" required /><br />
                <textarea name="opis" value={formData.opis} onChange={handleChange} placeholder="Opis" required /><br />
                <input type="number" name="cijena" value={formData.cijena} onChange={handleChange} placeholder="Cijena" required /><br />
                <label>
                    Raspoloživo:
                    <input type="checkbox" name="raspolozivo" checked={formData.raspolozivo} onChange={handleChange} />
                </label><br />
                <input type="text" name="putanjaSlike" value={formData.putanjaSlike} onChange={handleChange} placeholder="Putanja slike" required /><br />
                <button type="submit">Dodaj post</button>
            </form>
        </div>
    );
}

export default AboutUs;