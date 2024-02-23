import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Post } from './types/PostType';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardMedia, Fab, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from "@mui/material/Divider";
import UpdatePostDialog from './UpdatePostDialog'; // Import the UpdatePostDialog component

function Posts(props: { numberOfPosts?: number; }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedPost, setSelectedPost] = useState<Post | null>(null); // State to store the selected post for update
    const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false); // State to manage the open/close state of the update dialog

    const fetchPosts = async (numberOfPosts?: number) => {
        const suffix = numberOfPosts ? `?numberOfPosts=${numberOfPosts}` : "";
        try {
            const response = await axios.get(`http://localhost:8080/posts${suffix}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts(props.numberOfPosts).then((data) => {
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
            await axios.patch(`http://localhost:8080/posts/${selectedPost?._id}`, updatedPostData);
            const updatedPosts = await fetchPosts();
            setPosts(updatedPosts);
            setUpdateDialogOpen(false);
        } catch (error) {
            console.error('Error updating post:', error);
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
                        <Card variant="outlined" sx={{ width: "100%", maxWidth: 1200, aspectRatio: 8 / 12 }}>
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
                                    <Typography variant="h6" gutterBottom>
                                        Cijena: {post.cijena} €
                                    </Typography>
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
                            <Box>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Fab size="small" color="secondary" aria-label="edit">
                                        <EditIcon onClick={() => handleUpdatePost(post._id)} />
                                    </Fab>
                                    <DeleteIcon onClick={() => deletePost(post._id)}>
                                        Obrisi
                                    </DeleteIcon>
                                </Stack>
                            </Box>
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
