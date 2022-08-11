/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Stack } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import CollectionList from '../../components/Admin/CollectionList';
import { connectionContext } from '../../components/Contexts/connectionContext';
import NavBar from '../../components/NavBar/NavBar';
import { pageContainerStyle } from '../common/style';
import UserForm from '../../components/Forms/UserForm';

function CollectionListPage() {
    const { user, isAdmin } = useContext(connectionContext);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        if (!isAdmin) {
            setShowLogin(true);
        } else {
            setShowLogin(false);
        }
    }, [isAdmin]);

    return (
        <>
            <NavBar user={user} />
            <Stack sx={pageContainerStyle}>
                {isAdmin && <CollectionList />}
                <Modal open={showLogin}>
                    <UserForm mode="login" embiggenForm={setShowLogin} />
                </Modal>
            </Stack>
        </>
    );
}

export default CollectionListPage;
