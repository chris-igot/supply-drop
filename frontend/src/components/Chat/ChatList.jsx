/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox';
import {
    Badge,
    Divider,
    Fab,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Modal,
    Paper,
    Typography,
} from '@mui/material';
import { ChatBubbleOutline, Close } from '@mui/icons-material';
import { useContext } from 'react';
import { connectionContext } from '../Contexts/connectionContext';

function ChatList({ userId }) {
    const [groupMessages, setGroupMessages] = useState([]);
    const [bigChatList, setBigChatList] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState({});
    const { latestStatus } = useContext(connectionContext);

    useEffect(() => {
        updateGroupMessages();
    }, []);

    useEffect(() => {
        console.log({ latestStatus });
        if (latestStatus) {
            switch (latestStatus.type) {
                case 'message-received':
                    setCount(latestStatus.data.groupId, 'add');
                    break;
                case 'chat-created':
                    updateGroupMessages();
                    break;
                default:
                    break;
            }
        }
    }, [latestStatus]);

    function updateGroupMessages() {
        axios
            .get('/api/message/self', {
                withCredentials: true,
            })
            .then((res) => {
                let data = res.data;
                let counts = {};

                data.forEach((group) => {
                    group.bigChat = false;
                    counts[group._id] = 0;
                    group.userData.find((userDatum) => {
                        const found = userDatum.userId === userId;

                        if (found) {
                            counts[group._id] += userDatum.messagesUnread;
                        }
                        return found;
                    });
                });
                setUnreadCounts(counts);
                setGroupMessages(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function embiggen(index, active) {
        let tempGroupMessages = [...groupMessages];

        tempGroupMessages[index].bigChat = active;
        if (active) {
            setCount(tempGroupMessages[index]._id, 'zero');
        }
        setGroupMessages(tempGroupMessages);
    }

    function getOtherUser(groupMessage) {
        const user = groupMessage.users.find((user) => userId !== user._id);
        return user.firstName + ' ' + user.lastName;
    }

    function getCounts(groupId = 'all') {
        let count = 0;
        console.log({ unreadCounts, groupMessages });
        if (groupId === 'all') {
            for (const id in unreadCounts) {
                count += unreadCounts[id];
            }
        } else {
            count = unreadCounts[groupId];
        }

        return count;
    }

    function setCount(groupId, type = 'add', num = 1) {
        let newCounts = { ...unreadCounts };

        switch (type) {
            case 'add':
                newCounts[groupId] += num;
                setUnreadCounts(newCounts);
                break;
            case 'zero':
                newCounts[groupId] = 0;
                setUnreadCounts(newCounts);
                break;
            default:
                break;
        }
    }

    return (
        <>
            <Modal open={bigChatList}>
                <Paper
                    elevation={6}
                    sx={{
                        padding: '1em',
                        maxWidth: '600px',
                        maxHeight: '80%',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ float: 'left' }}>
                                Conversations
                            </Typography>
                            <Close
                                sx={{ float: 'right', cursor: 'pointer' }}
                                onClick={() => {
                                    setBigChatList(false);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{ marginBlock: '0.5em' }} />
                            <List>
                                {groupMessages.map((groupMessage, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem
                                            disablePadding
                                            onClick={() => {
                                                embiggen(index, true);
                                            }}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <ListItemButton sx={{ padding: 0 }}>
                                                <ListItemIcon
                                                    sx={{ minWidth: '32px' }}
                                                >
                                                    <Badge
                                                        badgeContent={getCounts(
                                                            groupMessage._id
                                                        )}
                                                        color="error"
                                                    >
                                                        <ChatBubbleOutline />
                                                    </Badge>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={getOtherUser(
                                                        groupMessage
                                                    )}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                        <Modal open={groupMessage.bigChat}>
                                            <ChatBox
                                                groupId={groupMessage._id}
                                                userId={userId}
                                                index={index}
                                                embiggenChat={embiggen}
                                            />
                                        </Modal>
                                    </React.Fragment>
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
                sx={{ position: 'fixed', bottom: '1rem', right: '10%' }}
            >
                <Badge badgeContent={getCounts()} color="error">
                    <ChatBubbleOutline
                        fontSize="large"
                        style={{ position: 'relative', top: '2px' }}
                    />
                </Badge>

                <span style={{ position: 'absolute', bottom: '32%' }}>
                    {groupMessages.length || ''}
                </span>
            </Fab>
        </>
    );
}

export default ChatList;
