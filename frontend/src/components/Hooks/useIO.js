/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuth from './useAuth';

function useIO(
    messageCB = (data) => {
        console.log(data);
    },
    statusCB = (data) => {
        console.log(data);
    }
) {
    const { userId, token, isLoggedIn } = useAuth();
    const messageCBRef = useRef(messageCB);
    const statusCBRef = useRef(statusCB);
    const ioRef = useRef(
        io({
            reconnectionDelayMax: 10000,
            query: {
                userId,
                token,
            },
        })
    );

    useEffect(() => {
        if (isLoggedIn) {
            ioRef.current = io({
                reconnectionDelayMax: 10000,
                query: {
                    userId,
                    token,
                },
            });

            if (ioRef.current.disconnected) {
                ioRef.current.connect();
                ioRef.current.on('message', messageCB.current);
                ioRef.current.on('status', statusCB.current);
                console.log('connected', ioRef.current.connected);
            }
        } else {
            if (ioRef.current.connected) {
                ioRef.current.disconnect();
            }
        }
    }, [isLoggedIn, messageCBRef.current, statusCBRef.current]);

    function setMessageCB(cb) {
        messageCBRef.current = cb;
    }

    function setStatusCB(cb) {
        statusCBRef.current = cb;
    }

    return { io: ioRef.current, setMessageCB, setStatusCB, userId };
}

export default useIO;
