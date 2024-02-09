import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Post } from './types/PostType';

function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            <h1>Posts</h1>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        <h2>{post.ime + post.cijena + post.raspolozivo + post.putanjaSlike}</h2>
                        <p>
                            <img src={post.putanjaSlike} alt={"slika"}></img>
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Posts;

