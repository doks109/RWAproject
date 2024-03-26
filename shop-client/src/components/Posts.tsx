import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { Post } from './types/PostType';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate} from "react-router-dom";
import {
    Alert,
    Card,
    CardMedia,
    debounce,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from "@mui/material/Divider";
import UpdatePostDialog from './UpdatePostDialog';
import AuthService from "./auth/AuthService";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Tooltip from '@mui/material/Tooltip';
import Button from "@mui/material/Button";


function Posts(props: { numberOfPosts?: number; }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const navigate = useNavigate();
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchPosts = async (numberOfPosts?: number) => {
        const suffix = numberOfPosts ? `?numberOfPosts=${numberOfPosts}` : "";
        try {
            const response = await axios.get(`http://localhost:8080/posts${suffix}`);
            return response.data;
        } catch (error) {
            console.error('Greška kod dohvata:', error);
        }
    };

    useEffect(() => {
        fetchPosts(props.numberOfPosts).then((data) => {
            setPosts(data)
        });
    }, []);


    const deletePost = async (id: string) => {
        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            await axios.delete(`http://localhost:8080/post/${id}` , { headers });
            const updatedPosts = await fetchPosts();
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Greška kod brisanja:', error);
        }
        handleClose();
    };

    const handleUpdatePost = (id: string) => {
        const selectedPost = posts.find(post => post._id === id) || null;
        setSelectedPost(selectedPost);
        setUpdateDialogOpen(true);
    };

    const handleCloseUpdateDialog = () => {
        setUpdateDialogOpen(false);
    };

    const handleUpdatePostData = async (updatedData: Partial<Post>) => {
        try {
            const updatedPostData = {
                ...selectedPost,
                ...updatedData
            };
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            await axios.patch(`http://localhost:8080/posts/${selectedPost?._id}`, updatedPostData, {headers});
            const updatedPosts = await fetchPosts();
            setPosts(updatedPosts);
            setUpdateDialogOpen(false);
        } catch (error) {
            console.error('Greška kod update:', error);
        }
    };

    const handleBuy = async (id: string, kolicina: number, cijena: number) => {
        const currentUser = AuthService.getCurrentUser();
        const userId = currentUser.id;

        try {
            const token = AuthService.getToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            await axios.post(`http://localhost:8080/addItem/${id}/${kolicina}/${cijena}`, userId, {headers});
            navigate("/ponuda");
        } catch (error) {
            console.error('Greška kod kupnje', error);
        }
    }
    const handleBuy2 = debounce(handleBuy, 300);
    const handleBuy3 = useCallback(handleBuy2, []);


    const handleLogin = async () => {
        navigate("/login");
    }


    function calculatePrice(cijena: number, popust: number){
        let newPrice;
        newPrice = (cijena) - (cijena * (popust/100));
        return newPrice;
    }

    const [openDialogId, setOpenDialogId] = useState<string | null>(null);

    const handleClickOpen = (postId: string) => {
        setOpenDialogId(postId);
    };

    const handleClose = () => {
        setOpenDialogId(null);
    };


    return (
        <Container maxWidth="lg">
            {AuthService.isAdmin() &&
                <Box alignItems="center" sx={{ display: 'flex', flexDirection: 'row', mt: 5, mb: -5}}>
                    <Typography variant="h5">
                        Dodaj novi artikl
                    </Typography>
                    <Tooltip title={"Dodaj artikl"} disableFocusListener>
                        <Fab size="small" color="primary" aria-label="add" onClick={() => navigate("/addPost")} sx={{ ml: 2}}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </Box>
            }
            <Grid container spacing={2} sx={{ mt: 5, mb: 5}}>
                {posts.map((post, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined" sx={{ width: "100%", aspectRatio: 8 / 13, display: 'flex', flexDirection: 'column'}}>
                            <Box>
                                <Stack justifyContent="space-between" alignItems="center">
                                    <CardMedia
                                        sx={{ width: "100%", aspectRatio: 10 / 8 }}
                                        image={post.putanjaSlike}
                                        title={post.ime}
                                    />
                                </Stack>
                            </Box>
                            <Box>
                                <Stack justifyContent="space-between" alignItems="center">
                                    <Typography variant="h5" gutterBottom>
                                        {post.ime}
                                    </Typography>
                                </Stack>
                            </Box>
                            <Divider />
                            <Box>
                                <Stack justifyContent="space-between" alignItems="center">
                                    <Typography variant="body1" gutterBottom>
                                        Kategorija: {post.kategorija}
                                    </Typography>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6" gutterBottom>
                                            <strong>Cijena: {post.cijena} €</strong>
                                        </Typography>
                                        {(post.popust > 0) &&
                                            <Typography variant="h5" gutterBottom sx={{ml: 2}}>
                                                <strong>-</strong>{post.popust}%
                                            </Typography>
                                        }
                                    </Stack>
                                    {(post.popust > 0) &&
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="h6" color="primary" gutterBottom>
                                                Nova cijena: {calculatePrice(post.cijena, post.popust).toFixed(2)} €
                                            </Typography>
                                        </Stack>
                                    }
                                    <Typography variant="body1" gutterBottom>
                                        Raspoloživo: {post.raspolozivo ? 'Da' : 'Ne'}
                                    </Typography>
                                </Stack>
                            </Box>
                            <Divider />
                            <Box>
                                <Stack justifyContent="space-between" alignItems="left">
                                    <Typography variant="body1" gutterBottom color="text.secondary">
                                        Opis: {post.opis}
                                    </Typography>
                                </Stack>
                            </Box>
                            {AuthService.isAdmin() && (
                                <Box sx={{marginTop: "auto", mb: 2, ml: 2, mr: 2}}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Tooltip title={"Promjeni artikl"} disableFocusListener>
                                            <Fab size="small" color="secondary" aria-label="edit">
                                                <EditIcon onClick={() => handleUpdatePost(post._id)} />
                                            </Fab>
                                        </Tooltip>
                                        <Tooltip title={"Obriši artikl"}>
                                            <DeleteIcon onClick={() => handleClickOpen(post._id)}>
                                                Obrisi
                                            </DeleteIcon>
                                        </Tooltip>
                                        <Dialog open={openDialogId === post._id} onClose={handleClose}>
                                            <DialogTitle id="alert-dialog-title">{"Obrisati artikl ?"}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    Klikom na opciju "DA" potvrditi brisanje artikla.
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose}>Ne</Button>
                                                <Button onClick={() => deletePost(post._id)} autoFocus>
                                                    Da
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </Stack>
                                </Box>
                            )}

                            {AuthService.isUser() &&
                                <Box sx={{marginTop: "auto", mb: 1}}>
                                    <Stack direction="column" alignItems={"center"}>
                                        <Tooltip disableFocusListener title={"Dodaj u košaricu !"}>
                                            <Fab size="small" color="primary" aria-label="buy">
                                                {(post.popust > 0) ?
                                                    <ShoppingCartIcon onClick={() => handleBuy3(post._id, 1, calculatePrice(post.cijena, post.popust))} />
                                                    :
                                                    <ShoppingCartIcon onClick={() => handleBuy3(post._id, 1, post.cijena)} />
                                                }
                                            </Fab>
                                        </Tooltip>
                                    </Stack>
                                </Box>
                            }
                            {(!AuthService.isUser() && !AuthService.isAdmin()) &&
                                <Box sx={{marginTop: "auto"}}>
                                    <Stack justifyContent="space-between" alignItems="center">
                                        <Fab size="small" color="primary" aria-label="buy">
                                            <Tooltip disableFocusListener title={"Prijavi se ili registriraj !"}>
                                                <ShoppingCartIcon onClick={() => handleLogin()} />
                                            </Tooltip>
                                        </Fab>
                                        <Typography>
                                            Prijavi se ili registriraj za nastavak.
                                        </Typography>
                                    </Stack>
                                </Box>
                            }
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <UpdatePostDialog
                open={isUpdateDialogOpen}
                handleClose={handleCloseUpdateDialog}
                handleUpdatePostData={handleUpdatePostData}
                post={selectedPost}
            />
        </Container>
    );
}

export default Posts;
