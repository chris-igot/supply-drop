/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox';
import './Chat.css';
import {
    Badge,
    Fab,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Modal,
    Paper,
} from '@mui/material';
import { AddCircle, ChatBubbleOutline, Close } from '@mui/icons-material';

function ChatList({ userId }) {
    const [groupMessages, setGroupMessages] = useState([]);
    const [bigChatList, setBigChatList] = useState(false);

    useEffect(() => {
        axios
            .get('http://localhost:8000/api/message/self', {
                withCredentials: true,
            })
            .then((res) => {
                let data = res.data;
                data.forEach((item) => {
                    item.bigChat = false;
                });
                setGroupMessages(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function embiggen(index, active) {
        let tempGroupMessages = [...groupMessages];

        tempGroupMessages[index].bigChat = active;
        setGroupMessages(tempGroupMessages);
    }

    function getOtherUser(groupMessage) {
        const user = groupMessage.users.find((user) => userId !== user._id);
        return user.firstName + ' ' + user.lastName;
    }

    return (
        <>
            <Modal open={bigChatList}>
                <Paper
                    elevation={6}
                    sx={{
                        maxWidth: '600px',
                        maxHeight: '80%',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <Grid container>
                        <Grid xs={12}>
                            {' '}
                            <Close
                                sx={{ float: 'right', cursor: 'pointer' }}
                                onClick={() => {
                                    setBigChatList(false);
                                }}
                            />
                        </Grid>
                        <Grid xs={12}>
                            <List>
                                {groupMessages.map((groupMessage, index) => (
                                    <ListItem
                                        key={index}
                                        disablePadding
                                        onClick={() => {
                                            embiggen(index, true);
                                        }}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <ChatBubbleOutline />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    'Conversation with:' +
                                                    getOtherUser(groupMessage)
                                                }
                                            />
                                        </ListItemButton>
                                        <Modal open={groupMessage.bigChat}>
                                            <ChatBox
                                                groupId={groupMessage._id}
                                                userId={userId}
                                                index={index}
                                                embiggenChat={embiggen}
                                            />
                                        </Modal>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                </Paper>
            </Modal>

            <Fab
                color="primary"
                aria-label="add"
                onClick={() => setBigChatList(true)}
                sx={{ position: 'absolute', bottom: '1rem', right: '10%' }}
            >
                <Badge badgeContent={groupMessages.length} color="error">
                    <ChatBubbleOutline />
                </Badge>
            </Fab>
        </>
    );
}

export default ChatList;
