import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import UserForm from '../../components/UserForm/UserForm';

const Login = (props) => {
    return (
        <div style={{ marginTop: '5rem' }}>
            <NavBar />
            <UserForm mode="login" />
        </div>
    );
};

export default Login;
