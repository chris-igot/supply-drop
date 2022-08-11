import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Post from '../Post/Post';
import PostForm from '../Forms/PostForm';
import { Edit, Place } from '@mui/icons-material';
import DeleteConfirm from '../Forms/DeleteConfirm';
import {
    Box,
    Chip,
    Divider,
    Grid,
    Modal,
    Paper,
    Typography,
} from '@mui/material';
import { useContext } from 'react';
import { connectionContext } from '../Contexts/connectionContext';

const HomePosts = ({ ownPosts }) => {
    const { user, isLoggedIn } = useContext(connectionContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        updatePosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const updatePosts = () => {
        axios
            .get('/api/post/')
            .then((res) => {
                let data = res.data;
                data.reverse();
                data.forEach((element) => {
                    element.bigPost = false;
                    element.bigEdit = false;
                });

                if (ownPosts) {
                    data = data.filter(function (post) {
                        return post.postedBy._id === user._id;
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
            .delete(`/api/post/${postID}`, {
                withCredentials: true,
            })
            .then((res) => {
                updatePosts();
            })
            .catch((err) => console.log(err, 'error deleting'));
    };

    const embiggenComponent = (postIndex, active, bigType) => {
        let tempPosts = [...posts];

        if (bigType === 'post') {
            tempPosts[postIndex].bigPost = active;
        } else {
            tempPosts[postIndex].bigEdit = active;
        }

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
                                    <Place
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
                                {user && post.postedBy._id === user._id && (
                                    <Box>
                                        <DeleteConfirm
                                            confirmMessage={`Are you sure you want to delete Post(${post.title})?`}
                                            onClick={() => {
                                                handleDelete(post._id);
                                            }}
                                            sx={{
                                                marginLeft: '0.5rem',
                                                float: 'right',
                                                cursor: 'pointer',
                                            }}
                                        />

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
                            isLoggedIn={isLoggedIn}
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
