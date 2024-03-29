/* eslint-disable react-hooks/exhaustive-deps */
import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import useAuth from '../Hooks/useAuth';

const connectionContext = React.createContext({
    user: undefined,
    userId: undefined,
    token: undefined,
    isLoggedIn: false,
    ioConnected: false,
    io: undefined,
});

function ConnectionContextProvider(props) {
    const { user, userId, token, isLoggedIn, isAdmin, updateUser } = useAuth();
    const [latestMessage, setLatestMessage] = useState(null);
    const [latestStatus, setLatestStatus] = useState(null);
    const [ioConnected, setIoConnected] = useState(false);

    const [ioState, setIO] = useState(
        io({
            autoConnect: false,
        })
    );

    useEffect(() => {
        connect();
    }, [isLoggedIn, ioState.disconnected]);

    function connect() {
        if (isLoggedIn && ioState && !ioConnected) {
            const newIO = io({
                autoConnect: false,
                query: {
                    userId,
                    token,
                },
            });
            newIO.connect();

            newIO.on('connect', () => {
                console.log('CONNECTED', newIO.connected);
                newIO.on('message', setLatestMessage);
                newIO.on('status', setLatestStatus);
                setIoConnected(true);
            });
            newIO.on('disconnect', () => {
                setIoConnected(false);
                console.log('DISCONNECTED');
            });
            setIO(newIO);
        }
    }

    return (
        <connectionContext.Provider
            value={{
                user,
                userId,
                token,
                isLoggedIn,
                isAdmin,
                updateUser,
                io: ioState,
                latestMessage,
                setLatestMessage,
                latestStatus,
                setLatestStatus,
                ioConnected,
            }}
        >
            {props.children}
        </connectionContext.Provider>
    );
}

export default ConnectionContextProvider;
export { connectionContext };
