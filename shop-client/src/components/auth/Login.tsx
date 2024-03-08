import React, { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, CssBaseline, FormControl, Grid, TextField, Typography} from "@mui/material";
import AuthService from "./AuthService";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({ username: "", password: "" });

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            navigate("/about");
        }
    }, [navigate]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault();

        setMessage("");
        setLoading(true);

        AuthService.login(formData.username, formData.password)
            .then(() => {
                navigate("/ponuda");
            })
            .catch(() => {
                setMessage("Neuspješna prijava !");
                setLoading(false);
            });
    };

    return (
        <Container maxWidth={"xs"}>
            <CssBaseline />
            <Box sx={{ mt: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h5">Prijava</Typography>
                <Box sx={{ mt: 3 }}>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <FormControl>
                        <TextField
                            name="username"
                            label="Korisničko ime"
                            variant="outlined"
                            value={formData.username}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            name="password"
                            label="Lozinka"
                            type="password"
                            variant="outlined"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                        >
                            Prijavi se
                        </Button>
                        </FormControl>
                    </form>
                    <Typography>
                        {message}
                    </Typography><br />
                </Box>
                <Grid item>
                    <Typography>
                        Nemaš korisnički račun? <Link to="/register">Registracija</Link>
                    </Typography>
                </Grid>
            </Box>
        </Container>
    );
};

export default Login;
