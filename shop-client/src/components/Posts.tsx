import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Post } from './types/PostType';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useNavigate, useParams} from "react-router-dom";
import Button from "@mui/material/Button";
import {Card, CardMedia, Chip, Fab, Stack} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from "@mui/material/Divider";


function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const {id} = useParams();
    const navigate = useNavigate();

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/posts');
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts().then((data) => {
            setPosts(data)
        });
    }, []);

    const deletePost = async (id: string) => {
        try {
            await axios.delete(`http://localhost:8080/post/${id}`);
            const updatedPosts = await fetchPosts();
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Fab size="small" color="primary" aria-label="add" onClick={() => navigate("/addPost")}>
                <AddIcon />
            </Fab>
            <Grid container spacing={2}>
                {posts.map((post, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined" sx={{ width: "100%", maxWidth: 1200, aspectRatio: 8 / 11}}>
                            <Box>
                                <Stack>
                                    <CardMedia
                                        sx={{ width: "100%", aspectRatio: 10 / 7 }}
                                        image= {post.putanjaSlike}
                                        title={post.ime}
                                    />
                                    <Typography variant="h5" gutterBottom>
                                        {post.ime}
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Kategorija: {post.kategorija}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom color="text.secondary">
                                        Opis: {post.opis}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Cijena: {post.cijena} €
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Raspoloživo: {post.raspolozivo ? 'Da' : 'Ne'}
                                    </Typography>
                                    <Fab size="small" color="secondary" aria-label="edit">
                                        <EditIcon />
                                    </Fab>
                                    <DeleteIcon onClick = {() => deletePost(post._id)}>
                                        Obrisi
                                    </DeleteIcon>
                                </Stack>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
    return (
        <Card variant="outlined" sx={{ maxWidth: 360 }}>
            <Box sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography gutterBottom variant="h5" component="div">
                        Toothbrush
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        $4.50
                    </Typography>
                </Stack>
                <Typography color="text.secondary" variant="body2">
                    Pinstriped cornflower blue cotton blouse takes you on a walk to the park or
                    just down the hall.
                </Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
                <Typography gutterBottom variant="body2">
                    Select type
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Chip color="primary" label="Soft" size="small" />
                    <Chip label="Medium" size="small" />
                    <Chip label="Hard" size="small" />
                </Stack>
            </Box>
        </Card>
    );
}

export default Posts;