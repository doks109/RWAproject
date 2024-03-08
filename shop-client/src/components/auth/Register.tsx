import React, { useState } from "react";
import {Button, CssBaseline, Divider, FormControl, Grid, TextField, Typography} from "@mui/material";
import AuthService from "./AuthService";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {Link, useNavigate} from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");

    const handleRegister = (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        setMessage("");
        setSuccessful(false);

        AuthService.register(username, email, password)
            .then((response) => {
                setMessage(response.data.message);
                setSuccessful(true);
                AuthService.login(username, password).then(() => {
                    navigate("/ponuda");
                });
            })
            .catch((error) => {
                setMessage(error.response.data.message || "Neuspješna registracija !");
                setSuccessful(false);
            });
    };

    return (
        <Container maxWidth = "xs">
            <CssBaseline />
            <Box sx={{ mt: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h5">Registracija</Typography>
                <Box sx={{ mt: 3 }}>
                    <form onSubmit={(e) => handleRegister(e)}>
                        <FormControl>
                                    <TextField
                                        name="username"
                                        label="Korisničko ime"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required
                                        inputProps={{ minLength: 3, maxLength: 20 }}
                                    />
                                    <TextField
                                        name="email"
                                        label="Email"
                                        type="email"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required
                                    />
                                    <TextField
                                        name="password"
                                        label="Lozinka"
                                        type="password"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required
                                        inputProps={{ minLength: 6, maxLength: 40 }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        Registriraj se
                                    </Button>
                                </FormControl>
                            </form>
                        <Typography>
                            {message}
                        </Typography> <br />
                </Box>
                <Grid item>
                    <Typography>
                        Već imaš korisnički račun? <Link to="/login">Prijava</Link>
                    </Typography>
                </Grid>
            </Box>
        </Container>
    );
};

export default Register;
