import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Logout from '../Logout/Logout';
import './NavBar.css';
import logo from './logo.webp';
const NavBar = () => {
    const [user, setUser] = useState();

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/auth`, { withCredentials: true })
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="nav flex align-center">
            <div className="flex align-center">
                <h1 className="title-logo">
                    Supply <span className="gold">Drop</span>
                </h1>
                <img src={logo} alt="" srcset="" className="supply-drop-logo" />
            </div>
            <div className="flex align-center">
                <Link to="/" className="no-border">
                    Home
                </Link>

                {user && <Link to={`/account/${user._id}`}>Account</Link>}
                {user ? (
                    <div className="logged flex align-center">
                        <Logout />
                        <p className="user">
                            Hello,{' '}
                            <span className="username">
                                {user.firstName} {user.lastName}
                            </span>
                        </p>
                    </div>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </div>
    );
};

export default NavBar;
