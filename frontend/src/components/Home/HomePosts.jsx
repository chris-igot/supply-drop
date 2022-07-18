import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Post from '../Post/Post';
import PostForm from '../Forms/PostForm';
import { Edit, DeleteForever, PinDrop } from '@mui/icons-material';
import {
    Box,
    Chip,
    Divider,
    Grid,
    Modal,
    Paper,
    Typography,
} from '@mui/material';

const HomePosts = (props) => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});
    const id = props.id;

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/auth`, { withCredentials: true })
            .then((res) => {
                setUser(res.data);
                updatePosts();
            })
            .catch((err) => {
                console.log(err);
                updatePosts();
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updatePosts = () => {
        axios
            .get('http://localhost:8000/api/post/')
            .then((res) => {
                let data = res.data;
                data.reverse();
                data.forEach((element) => {
                    element.bigPost = false;
                    element.bigEdit = false;
                });

                if (id) {
                    data = data.filter(function (props) {
                        return props.postedBy._id === id;
                    });
                }

                setPosts(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleDelete = (postID) => {
        axios
            .delete(`http://localhost:8000/api/post/${postID}`, {
                withCredentials: true,
            })
            .then((res) => {
                updatePosts();
            })
            .catch((err) => console.log(err, 'error deleting'));
    };

    const embiggenComponent = (postIndex, active, bigType) => {
        let tempPosts = [...posts];
        console.log('EMBIGGEN!', postIndex, tempPosts[postIndex]);

        if (bigType === 'post') {
            tempPosts[postIndex].bigPost = active;
        } else {
            tempPosts[postIndex].bigEdit = active;
        }
        console.log('EMBIGGEN!', tempPosts);

        setPosts(tempPosts);
    };

    return (
        <>
            {posts.map((post, index) => (
                <React.Fragment key={index}>
                    <Paper sx={{ padding: '1rem' }}>
                        <Grid container>
                            <Grid item xs={10}>
                                <Typography
                                    component="p"
                                    sx={{ fontStyle: 'italic' }}
                                >
                                    {post.postedBy.firstName}{' '}
                                    {post.postedBy.lastName}
                                </Typography>
                                <Typography
                                    component="h4"
                                    sx={{ fontWeight: 800 }}
                                >
                                    {post.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                {/* <Chip>{post.postType}</Chip> */}
                                <Chip
                                    label={post.postType}
                                    sx={{
                                        padding: '4px 0 0 1px',
                                        float: 'right',
                                        fontSize: '18px',
                                        fontFamily: 'Bebas Neue',
                                        color: 'white',
                                        backgroundColor:
                                            post.postType === 'offering'
                                                ? '#EE9C4A'
                                                : '#5690C3',
                                    }}
                                />
                                {/* {post.postType} */}
                            </Grid>
                            <Grid
                                item
                                xs={10}
                                sx={{ cursor: 'pointer' }}
                                onClick={() =>
                                    embiggenComponent(index, true, 'post')
                                }
                            >
                                <Typography
                                    component="h6"
                                    sx={{
                                        position: 'relative',
                                        fontSize: '13px',
                                    }}
                                >
                                    <PinDrop
                                        sx={{
                                            position: 'relative',
                                            top: '3px',
                                            fontSize: '16px',
                                        }}
                                    />
                                    {post.location}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                {post.postedBy._id === user._id && (
                                    <Box>
                                        <Edit
                                            onClick={() => {
                                                embiggenComponent(
                                                    index,
                                                    true,
                                                    'edit'
                                                );
                                            }}
                                            sx={{
                                                float: 'right',
                                                cursor: 'pointer',
                                            }}
                                        />

                                        <DeleteForever
                                            onClick={() => {
                                                handleDelete(post._id);
                                            }}
                                            sx={{
                                                float: 'right',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </Box>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{ cursor: 'pointer' }}
                                onClick={() =>
                                    embiggenComponent(index, true, 'post')
                                }
                            >
                                <Typography component="p">
                                    {post.description}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Modal open={post.bigEdit}>
                        <PostForm
                            embiggenForm={embiggenComponent}
                            index={index}
                            postID={post._id}
                        />
                    </Modal>

                    <Modal open={post.bigPost}>
                        <Post
                            {...post}
                            embiggenForm={embiggenComponent}
                            index={index}
                        />
                    </Modal>
                </React.Fragment>
            ))}
        </>
    );
};

export default HomePosts;
