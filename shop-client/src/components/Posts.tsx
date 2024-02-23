import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Post } from './types/PostType';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";
import Button from "@mui/material/Button";


function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const {id} = useParams();

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
            <Grid container spacing={2}>
                {posts.map((post, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                {post.ime}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Kategorija: {post.kategorija}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Opis: {post.opis}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Cijena: {post.cijena}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Raspoloživo: {post.raspolozivo ? 'Da' : 'Ne'}
                            </Typography>
                            <img src={post.putanjaSlike} alt={post.ime} style={{ maxWidth: '100%', height: 'auto' }} />
                            <Button onClick = {() => deletePost(post._id)}>
                                Obrisi
                            </Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Posts;