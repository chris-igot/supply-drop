import axios from 'axios';
import { useEffect, useState } from 'react';

function useAuth() {
    const [user, setUser] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        updateUser();
    }, []);

    useEffect(() => {
        setIsLoggedIn(user ? true : false);
    }, [user]);

    function updateUser() {
        axios
            .get(`/api/auth`, { withCredentials: true })
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {});
    }

    return {
        user,
        isLoggedIn,
        userId: user ? user._id : undefined,
        token: user ? user.token : undefined,
        updateUser,
    };
}

export default useAuth;
