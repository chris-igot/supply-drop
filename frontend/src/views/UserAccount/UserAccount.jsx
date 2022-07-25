import React from 'react';
import HomePosts from '../../components/Home/HomePosts';
import NavBar from '../../components/NavBar/NavBar';
import ChatList from '../../components/Chat/ChatList';
import { Stack } from '@mui/material';
import { AccountTopBar } from '../../components/Home/AccountTopBar';
import { pageContainerStyle } from '../common/style';
import useAuth from '../../components/Hooks/useAuth';

const UserDetail = (props) => {
    const { user } = useAuth();

    return (
        user && (
            <>
                <NavBar user={user} />

                <Stack spacing={2} sx={pageContainerStyle}>
                    <AccountTopBar />
                    <HomePosts ownPosts={true} />
                </Stack>
                <ChatList userId={user._id} />
            </>
        )
    );
};

export default UserDetail;
