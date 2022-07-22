import React from 'react';
import axios from 'axios';
import { Button, Stack, TextField } from '@mui/material';

function StartChat({ recipientId, groupName }) {
    function handleSubmit(e) {
        e.preventDefault();
        let data = new FormData();

        data.append('users', recipientId);

        if (groupName) {
            data.append('groupName', groupName);
        }
        axios
            .post('/api/message/new', data, {
                withCredentials: true,
            })
            .then((res) => {
                console.log(res);
            })
            .catch((res) => {
                console.log(res);
            });
    }
    return (
        <form action="post" onSubmit={handleSubmit}>
            <Stack sx={{ marginRight: '0.5rem' }}>
                <TextField
                    id="chat-message"
                    name="chat-message"
                    label="message"
                    multiline
                    rows={4}
                    placeholder="say hello"
                    sx={{ marginBottom: '0.5rem' }}
                />
                <Button variant="outlined" type="submit">
                    Initiate Chat
                </Button>
            </Stack>
        </form>
    );
}

export default StartChat;
