import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.webp';
import {
    AppBar,
    Box,
    Button,
    Divider,
    Modal,
    Toolbar,
    Typography,
} from '@mui/material';
import UserForm from '../Forms/UserForm';
import { useRef } from 'react';
const NavBar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [bigUserForm, setBigUserForm] = useState(false);
    const userFormState = useRef('login');

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/auth`, { withCredentials: true })
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <AppBar component="nav">
            <Toolbar>
                <Typography
                    component="div"
                    sx={{
                        paddingInline: '1rem',
                        backgroundColor: 'white',
                        borderRadius: '50rem',
                    }}
                >
                    <Typography
                        variant="h4"
                        component="span"
                        sx={{ color: '#5690C3', fontFamily: 'Bebas Neue' }}
                    >
                        Supply
                    </Typography>{' '}
                    <Typography
                        variant="h4"
                        component="span"
                        sx={{ color: '#D89859', fontFamily: 'Bebas Neue' }}
                    >
                        Drop
                    </Typography>
                    <img
                        src={logo}
                        alt=""
                        srcSet=""
                        className="supply-drop-logo"
                    />
                </Typography>
                {user && (
                    <Typography component="span" sx={{ paddingLeft: '1rem' }}>
                        Hello,{' '}
                        <span className="username">
                            {user.firstName} {user.lastName}
                        </span>
                    </Typography>
                )}
                <Divider
                    sx={{
                        flexGrow: 1,
                        display: { xs: 'none', sm: 'block' },
                        visibility: 'hidden',
                    }}
                />
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Button
                        component={RouterLink}
                        to="/"
                        sx={{ color: 'white' }}
                    >
                        Home
                    </Button>
                    {user && (
                        <Button
                            component={RouterLink}
                            to={`/account/${user._id}`}
                            sx={{ color: 'white' }}
                        >
                            Account
                        </Button>
                    )}
                    {user ? (
                        <>
                            <Button
                                variant="outlined"
                                sx={{
                                    color: 'white',
                                    borderColor: 'white',
                                }}
                                onClick={(e) => {
                                    e.preventDefault();

                                    axios
                                        .post(
                                            'http://localhost:8000/api/user/logout',
                                            {},
                                            { withCredentials: true }
                                        )
                                        .then((res) => {
                                            console.log(res);
                                            navigate('/');
                                            window.location.reload();
                                            console.log('you are logged out');
                                        })
                                        .catch((err) => console.log(err));
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                sx={{
                                    color: 'white',
                                    borderColor: 'white',
                                }}
                                onClick={() => {
                                    userFormState.current = 'login';
                                    setBigUserForm(true);
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    color: 'white',
                                    borderColor: 'white',
                                }}
                                onClick={() => {
                                    userFormState.current = 'register';
                                    setBigUserForm(true);
                                }}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
            <Modal open={bigUserForm}>
                <UserForm
                    mode={userFormState.current}
                    embiggenForm={setBigUserForm}
                />
            </Modal>
        </AppBar>
    );
};

export default NavBar;
