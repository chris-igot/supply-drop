/* eslint-disable react-hooks/exhaustive-deps */
import { Stack } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CollectionTable from '../../components/Admin/CollectionTable';
import { connectionContext } from '../../components/Contexts/connectionContext';
import NavBar from '../../components/NavBar/NavBar';
import { pageContainerStyle } from '../common/style';

function CollectionPage() {
    const { collectionName } = useParams();
    const { user, isAdmin } = useContext(connectionContext);
    const navigate = useNavigate;

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, []);

    return (
        <>
            <NavBar user={user} />
            <Stack sx={pageContainerStyle}>
                <CollectionTable collectionName={collectionName} />
            </Stack>
        </>
    );
}

export default CollectionPage;
