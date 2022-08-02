/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { useRef } from 'react';
import { useContext } from 'react';
import { connectionContext } from '../Contexts/connectionContext';

function StartChat({ recipientId, groupName, closeForm }) {
    const { io, ioConnected, isLoggedIn, userId } =
        useContext(connectionContext);
    const messageRef = useRef(null);

    function handleSubmit(e) {
        e.preventDefault();
        if (ioConnected) {
            let newMessageObj = {};

            newMessageObj['users'] = [recipientId];

            if (groupName) {
                newMessageObj['groupName'] = groupName;
            }
            if (messageRef.current.value) {
                newMessageObj['message'] = messageRef.current.value;
            }

            io.emit('CREATE_CHAT', newMessageObj);
            closeForm();
        }
    }

    return (
        <form action="post" onSubmit={handleSubmit}>
            <Stack sx={{ marginRight: '0.5rem' }}>
                {isLoggedIn ? (
                    <>
                        {recipientId === userId ? (
                            <p>This is your own post</p>
                        ) : (
                            <TextField
                                id="chat-message"
                                name="chat-message"
                                label="message"
                                inputRef={messageRef}
                                multiline
                                rows={4}
                                placeholder="say hello"
                                sx={{ marginBottom: '0.5rem' }}
                            />
                        )}
                    </>
                ) : (
                    <p>Please Login to send a message</p>
                )}
                <Button
                    disabled={!isLoggedIn || recipientId === userId}
                    variant="outlined"
                    type="submit"
                >
                    Initiate Chat
                </Button>
            </Stack>
        </form>
    );
}

export default StartChat;
