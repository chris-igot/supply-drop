/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import {
    Box,
    Container,
    Divider,
    Grid,
    IconButton,
    InputBase,
    Paper,
    Typography,
} from '@mui/material';
import Message from './Message';
import { Close, Send } from '@mui/icons-material';
import { connectionContext } from '../Contexts/connectionContext';

const ChatBox = React.forwardRef(
    ({ groupId, userId, index, embiggenChat }, ref) => {
        const [messages, setMessages] = useState([]);
        const [socketMessages, setSocketMessages] = useState([]);
        const [users, setUsers] = useState({ a: 'default' });
        const scrollRef = useRef(null);
        const { io, latestMessage, setLatestMessage, setLatestStatus } =
            useContext(connectionContext);
        const joinedRef = useRef(false);

        useEffect(() => {
            if (!joinedRef.current) {
                io.emit('JOIN_CHAT', groupId);
                axios
                    .get('/api/message/' + groupId, {
                        withCredentials: true,
                    })
                    .then((res) => {
                        const groupInfo = res.data[0];
                        let tempUsers = {};
                        setMessages(groupInfo.messages);
                        groupInfo.users.forEach((user) => {
                            tempUsers[user._id] = user;
                        });
                        console.log({ groupInfo });
                        setUsers(tempUsers);
                        joinedRef.current = true;
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }

            return () => {
                io.emit('LEAVE_CHAT', groupId);
                setLatestMessage(null);
                setLatestStatus(null);
            };
        }, []);

        useEffect(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, [messages, socketMessages]);

        useEffect(() => {
            console.log({ latestMessage });
            if (latestMessage) {
                let tempMessages = [...socketMessages, latestMessage];

                setSocketMessages(tempMessages);
            }
        }, [latestMessage]);

        function handleSend(e) {
            e.preventDefault();
            const element = e.target.elements[0];
            const textMessage = element.value;
            io.send({ groupId, message: textMessage });
            element.value = '';
        }

        function getOtherUsers() {
            let otherUserNames = [];

            for (const userKey in users) {
                const user = users[userKey];

                if (userKey !== userId) {
                    otherUserNames.push(user.firstName + ' ' + user.lastName);
                }
            }

            return otherUserNames.join(', ');
        }

        return (
            <Container
                component={Paper}
                maxWidth="sm"
                elevation={12}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '600px',
                    maxHeight: '80%',
                    padding: '1rem',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                        Conversation with {getOtherUsers()}
                    </Typography>
                    <Close
                        sx={{
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            embiggenChat(index, false);
                        }}
                    />
                </Box>
                <Divider sx={{ marginBlock: '0.5em' }} />
                <Container sx={{ overflow: 'auto' }}>
                    <Grid container>
                        {messages.map((messageObject, index) => {
                            const user = users[messageObject.user];
                            console.log({ users });
                            const isSelf = user._id === userId;
                            return (
                                <Message
                                    key={index}
                                    name={user.firstName + ' ' + user.lastName}
                                    message={messageObject.message}
                                    isSender={isSelf}
                                />
                            );
                        })}
                        {socketMessages.map((messageObject, index) => {
                            const user = users[messageObject.user];
                            console.log({ users });
                            const isSelf = user._id === userId;
                            return (
                                <Message
                                    key={index}
                                    name={user.firstName + ' ' + user.lastName}
                                    message={messageObject.message}
                                    isSender={isSelf}
                                />
                            );
                        })}
                    </Grid>
                    <div ref={scrollRef}></div>
                </Container>
                <Paper
                    elevation={6}
                    component="form"
                    sx={{
                        display: 'flex',
                        marginTop: '1em',
                        padding: '0.25em',
                    }}
                    onSubmit={handleSend}
                >
                    <InputBase
                        placeholder="Say something..."
                        id={'textMessage-' + groupId}
                        type="text"
                        autoComplete="off"
                        name="textMessage"
                        sx={{ flexGrow: 1, paddingLeft: '0.5em' }}
                    />
                    <IconButton type="submit">
                        <Send />
                    </IconButton>
                </Paper>
            </Container>
        );
    }
);

export default ChatBox;
