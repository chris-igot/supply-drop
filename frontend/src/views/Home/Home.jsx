import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PostForm from '../../components/Forms/PostForm';
import HomePosts from '../../components/HomePosts/HomePosts';
import NavBar from '../../components/NavBar/NavBar';
import logo from '../../assets/logo.webp';
import ChatList from '../../components/Chat/ChatList';
import { Chip, Modal, Paper, Stack } from '@mui/material';

const Home = () => {
    const [user, setUser] = useState();
    const [bigForm, setBigForm] = useState(false);

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/auth`, { withCredentials: true })
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div style={{ paddingTop: '5rem', paddingBottom: '1rem' }}>
            <NavBar />

            <Stack spacing={2} sx={{ display: 'block' }}>
                {user && (
                    <Paper
                        sx={{
                            display: 'flex',
                            padding: '0.25rem 0.75rem 0.25rem 0.25rem',
                            alignItems: 'center',
                        }}
                    >
                        <img
                            src={logo}
                            alt=""
                            srcSet=""
                            className="supply-drop"
                        />
                        <Chip
                            label="What can you offer/request?"
                            sx={{
                                flexGrow: 1,
                                color: 'gray',
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                setBigForm(true);
                            }}
                        />
                    </Paper>
                )}

                <HomePosts />
            </Stack>

            {user && (
                <Modal open={bigForm}>
                    <PostForm
                        embiggenForm={(index, active) => {
                            setBigForm(active);
                        }}
                        userID={user._id || undefined}
                    />
                </Modal>
            )}

            {user && <ChatList userId={user._id} />}
        </div>
    );
};

export default Home;
