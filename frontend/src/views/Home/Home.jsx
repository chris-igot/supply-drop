import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PostForm from '../../components/Forms/PostForm';
import HomePosts from '../../components/Home/HomePosts';
import NavBar from '../../components/NavBar/NavBar';
import ChatList from '../../components/Chat/ChatList';
import { Modal, Stack } from '@mui/material';
import { HomeNewPostBar } from '../../components/Home/HomeNewPostBar';
import { pageContainerStyle } from '../common/style';

const Home = () => {
    const [user, setUser] = useState();
    const [bigForm, setBigForm] = useState(false);

    useEffect(() => {
        axios
            .get(`/api/auth`, { withCredentials: true })
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <>
            <NavBar />

            <Stack spacing={2} sx={pageContainerStyle}>
                {user && <HomeNewPostBar setBigForm={setBigForm} />}

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
        </>
    );
};

export default Home;
