import axios from 'axios';
import { useEffect, useState } from 'react';

function useAuth() {
    const [user, setUser] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        updateUser();
    }, []);

    useEffect(() => {
        setIsLoggedIn(user ? true : false);
        if (user && user.roles.includes('administrator')) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
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
        isAdmin,
        userId: user ? user._id : undefined,
        token: user ? user.token : undefined,
        updateUser,
    };
}

export default useAuth;
