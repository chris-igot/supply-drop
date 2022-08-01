import React from 'react';
import HomePosts from '../../components/Home/HomePosts';
import NavBar from '../../components/NavBar/NavBar';
import ChatList from '../../components/Chat/ChatList';
import { Stack } from '@mui/material';
import { AccountTopBar } from '../../components/Home/AccountTopBar';
import { pageContainerStyle } from '../common/style';
import { useContext } from 'react';
import { connectionContext } from '../../components/Contexts/connectionContext';

const UserDetail = (props) => {
    const { user } = useContext(connectionContext);

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
