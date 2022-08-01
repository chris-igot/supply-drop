import axios from 'axios';
import { useEffect, useState } from 'react';

function useAuth() {
    const [user, setUser] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        axios
            .get(`/api/auth`, { withCredentials: true })
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {});
    }, []);

    useEffect(() => {
        setIsLoggedIn(user ? true : false);
        // console.log({ user });
    }, [user]);

    return {
        user,
        isLoggedIn,
        userId: user ? user._id : undefined,
        token: user ? user.token : undefined,
    };
}

export default useAuth;
