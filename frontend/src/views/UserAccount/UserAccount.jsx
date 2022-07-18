import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HomePosts from '../../components/Home/HomePosts';
import NavBar from '../../components/NavBar/NavBar';
import ChatList from '../../components/Chat/ChatList';
import { Stack } from '@mui/material';
import { AccountTopBar } from '../../components/Home/AccountTopBar';
import { pageContainerStyle } from '../common/style';

const UserDetail = (props) => {
    const [user, setUser] = useState();
    const { id } = useParams();

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/user/${id}`, user, {
                withCredentials: true,
            })
            .then((res) => {
                //console.log(res)
            })
            .catch((err) => console.log(err));
    });

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/auth`, { withCredentials: true })
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        user && (
            <>
                <NavBar />

                <Stack spacing={2} sx={pageContainerStyle}>
                    <AccountTopBar />
                    <HomePosts id={id} />
                </Stack>
                <ChatList userId={id} />
            </>
        )
    );
};

export default UserDetail;
