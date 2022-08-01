/* eslint-disable react-hooks/exhaustive-deps */
import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import useAuth from '../Hooks/useAuth';

const connectionContext = React.createContext({
    user: undefined,
    userId: undefined,
    token: undefined,
    isLoggedIn: undefined,
    setMessageCB: undefined,
    setStatusCB: undefined,
    io: io({
        reconnectionDelayMax: 10000,
    }),
});

function ConnectionContextProvider(props) {
    const { user, userId, token, isLoggedIn } = useAuth();
    const [messageCBState, setMessageCB] = useState((data = 'NO DATA') => {
        console.log(data);
    });
    const [statusCBState, setStatusCB] = useState((data = 'NO DATA') => {
        console.log(data);
    });

    const [ioState, setIO] = useState(
        io({
            reconnectionDelayMax: 10000,
            query: {
                token,
            },
        })
    );

    useEffect(() => {
        if (isLoggedIn) {
            const newIO = io({
                reconnectionDelayMax: 10000,
                query: {
                    token,
                },
            });
            setIO(newIO);
            console.log({ isLoggedIn, userId, token });

            newIO.connect();
            newIO.on('message', messageCBState);
            newIO.on('status', statusCBState);
            console.log('connected', newIO.connected);
        } else {
            if (ioState.connected) {
                console.log('disconnect here');
                ioState.disconnect();
            }
        }
    }, [isLoggedIn, messageCBState, statusCBState]);
    return (
        <connectionContext.Provider
            value={{
                user,
                userId,
                token,
                isLoggedIn,
                setMessageCB,
                setStatusCB,
                io: ioState,
            }}
        >
            {props.children}
        </connectionContext.Provider>
    );
}

export default ConnectionContextProvider;
export { connectionContext };
