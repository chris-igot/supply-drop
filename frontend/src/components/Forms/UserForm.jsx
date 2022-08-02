/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Grid, Paper, Typography } from '@mui/material';
import logo from '../../assets/logo.webp';
import TextField from './TextField';
import { Close } from '@mui/icons-material';
import { connectionContext } from '../Contexts/connectionContext';

const UserForm = React.forwardRef(({ mode, embiggenForm, ...props }, ref) => {
    const navigate = useNavigate();
    const { user, isLoggedIn, updateUser } = useContext(connectionContext);
    const [errors, setErrors] = useState({});
    const [modeState, setModeState] = useState(mode);
    const [OkToRender, setOkToRender] = useState(false);

    useEffect(() => {
        switch (modeState) {
            case 'login':
            case 'register':
                setOkToRender(true);
                break;
            case 'edit':
                if (isLoggedIn) {
                    setOkToRender(true);
                }

                break;
            default:
                return;
        }
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        const inputs = e.currentTarget.querySelectorAll('input');
        let url;
        let data = new URLSearchParams();

        inputs.forEach((input) => {
            if (
                input.value &&
                typeof input.value === 'string' &&
                input.value.length > 0
            ) {
                data.append(input.name, input.value);
            }
        });

        switch (modeState) {
            case 'register':
                url = '/api/user/register';

                axios
                    .post(url, data, {
                        withCredentials: true,
                    })
                    .then((res) => {
                        navigate('/');
                        window.location.reload();
                    })
                    .catch((err) => {
                        const errResData = err.response.data.errors;
                        let errArr = {};

                        for (const key in errResData) {
                            errArr[key] = errResData[key]['message'];
                        }
                        setErrors(errArr);
                    });
                break;
            case 'edit':
                url = `/api/user/${isLoggedIn ? user._id : ''}`;

                axios
                    .put(url, data, {
                        withCredentials: true,
                    })
                    .then((res) => {
                        updateUser();
                        embiggenForm(false);
                    })
                    .catch((err) => {
                        const errResData = err.response.data.errors;
                        let errArr = {};

                        for (const key in errResData) {
                            errArr[key] = errResData[key]['message'];
                        }
                        setErrors(errArr);
                    });

                break;
            case 'login':
                axios
                    .post('/api/user/login', data)

                    .then((res) => {
                        navigate('/');
                        window.location.reload();
                    })
                    .catch((err) => {
                        setErrors({ password: 'Bad email or password' });
                    });
                break;
            default:
                break;
        }
    }

    const renderErrorMessage = (name) =>
        errors[name] && <div className="error">{errors[name]}</div>;

    function renderHeader(mode) {
        let bigText = '';

        switch (mode) {
            case 'register':
                bigText = 'Registration';
                break;
            case 'edit':
                bigText = 'Your Account Information';
                break;
            case 'login':
                bigText = 'Login';
                break;
            default:
                break;
        }

        return (
            <Typography
                variant="h3"
                component="h3"
                sx={{
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    fontFamily: 'Bebas Neue',
                    color: '#5690C3',
                }}
            >
                {bigText}
                <img src={logo} alt="" srcSet="" className="supply-drop-logo" />
            </Typography>
        );
    }

    function renderSubmitButton(mode) {
        let text = '';

        switch (mode) {
            case 'register':
                text = 'Register';
                break;
            case 'edit':
                text = 'Change Account Info';
                break;
            case 'login':
                text = 'Login';
                break;
            default:
                break;
        }

        return (
            <Button
                type="submit"
                variant="contained"
                sx={{ width: '100%', marginTop: '1rem' }}
            >
                {text}
            </Button>
        );
    }

    return (
        <Container
            component={Paper}
            elevation={3}
            maxWidth={'sm'}
            sx={{
                position: 'absolute',
                padding: '1rem',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(1)',
            }}
        >
            <form onSubmit={handleSubmit}>
                <Grid container>
                    {mode !== 'edit' && <Grid item xs={1}></Grid>}
                    <Grid item xs={mode === 'edit' ? 11 : 10}>
                        {renderHeader(modeState)}
                    </Grid>
                    <Grid item xs={1}>
                        <Close
                            sx={{ float: 'right', cursor: 'pointer' }}
                            onClick={() => {
                                embiggenForm(false);
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            OkToRender={
                                OkToRender &&
                                (modeState === 'register' ||
                                    modeState === 'edit')
                            }
                            name={'firstName'}
                            label={'First Name'}
                            defaultValue={
                                isLoggedIn ? user.firstName : undefined
                            }
                            errorMessage={renderErrorMessage('firstName')}
                        />
                        <TextField
                            OkToRender={
                                OkToRender &&
                                (modeState === 'register' ||
                                    modeState === 'edit')
                            }
                            name={'lastName'}
                            label={'Last Name'}
                            defaultValue={
                                isLoggedIn ? user.lastName : undefined
                            }
                            errorMessage={renderErrorMessage('lastName')}
                        />
                        <TextField
                            OkToRender={
                                OkToRender &&
                                (modeState === 'register' ||
                                    modeState === 'edit')
                            }
                            name={'username'}
                            label={'Username'}
                            defaultValue={
                                isLoggedIn ? user.username : undefined
                            }
                            errorMessage={renderErrorMessage('username')}
                        />
                        <TextField
                            OkToRender={OkToRender}
                            name={'email'}
                            label={'Email'}
                            defaultValue={isLoggedIn ? user.email : undefined}
                            errorMessage={renderErrorMessage('email')}
                        />
                        <TextField
                            OkToRender={OkToRender}
                            name={'password'}
                            label={'Password'}
                            type={'password'}
                            errorMessage={renderErrorMessage('password')}
                        />
                        <TextField
                            OkToRender={
                                modeState === 'register' || modeState === 'edit'
                            }
                            name={'confirmPassword'}
                            label={'Confirm Password'}
                            type={'password'}
                            errorMessage={renderErrorMessage('confirmPassword')}
                        />
                    </Grid>

                    {(modeState === 'register' || modeState === 'login') && (
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                marginBottom: '1rem',
                            }}
                        >
                            <Typography variant="caption">
                                {modeState === 'register' && (
                                    <>
                                        Already have an account?{' '}
                                        <Button
                                            onClick={() =>
                                                setModeState('login')
                                            }
                                        >
                                            Login
                                        </Button>
                                    </>
                                )}
                                {modeState === 'login' && (
                                    <>
                                        Haven't made an account yet?{' '}
                                        <Button
                                            onClick={() =>
                                                setModeState('register')
                                            }
                                        >
                                            Create a new account
                                        </Button>
                                    </>
                                )}
                            </Typography>
                            <Typography variant="caption">
                                Note: Accounts are NOT necessary to view posts
                            </Typography>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        {renderSubmitButton(modeState)}
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
});
export default UserForm;
