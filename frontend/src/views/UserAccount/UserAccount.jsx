import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HomePosts from '../../components/HomePosts/HomePosts';
import NavBar from '../../components/NavBar/NavBar';
import ChatList from '../../components/Chat/ChatList';
import { Button, Modal, Paper, Stack, Typography } from '@mui/material';
import { Settings } from '@mui/icons-material';
import UserForm from '../../components/UserForm/UserForm';

const UserDetail = (props) => {
    const [user, setUser] = useState();
    const [bigUserForm, setBigUserForm] = useState(false);
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

                <Stack
                    spacing={2}
                    sx={{
                        display: 'block',
                        paddingTop: '5rem',
                        paddingBottom: '1rem',
                    }}
                >
                    <Paper
                        elevation={5}
                        sx={{
                            display: 'flex',
                            padding: '1rem',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h4" component="h2">
                            Your Posts
                        </Typography>
                        <Button
                            sx={{ float: 'right' }}
                            onClick={() => setBigUserForm(true)}
                        >
                            Edit Account
                            <Settings />
                        </Button>
                        <Modal open={bigUserForm}>
                            <UserForm
                                mode="edit"
                                embiggenForm={setBigUserForm}
                            />
                        </Modal>
                    </Paper>
                    <HomePosts id={id} />
                </Stack>
                <ChatList userId={id} />
            </>
        )
    );
};

export default UserDetail;
