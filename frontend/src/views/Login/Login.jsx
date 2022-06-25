import React from "react";

import UserForm from "../../components/UserForm/UserForm";

const Login = (props) => {
    return (
        <div>
            <header>
                <h1>Login</h1>
            </header>
            <UserForm mode={"login"} />
        </div>
    );
};

export default Login;
