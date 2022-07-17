import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import Home from './views/Home/Home';
import View from './views/View/View';
import Logout from './components/Logout/Logout';
import EditPost from './components/UpdatePosts/UpdatePosts';
import UserDetail from './views/UserAccount/UserAccount';
import EditUser from './views/EditUser/EditUser';
import { Container } from '@mui/material';

function App() {
    return (
        <div className="App">
            <Container maxWidth="md">
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />}></Route>
                        <Route path="/register" element={<Register />}></Route>
                        <Route path="/" element={<Home />}></Route>
                        <Route path="/create" element={<Home />}></Route>
                        <Route path="/logout" element={<Logout />}></Route>

                        {/* IF YOU ARE DOING ACCOUNT PLZ CHANGE -> will be /account/id try to make id into the username if you can or not */}
                        <Route
                            path="/account/:id"
                            element={<UserDetail />}
                        ></Route>
                        <Route
                            path="/account/edit/:id"
                            element={<EditUser />}
                        ></Route>

                        {/* IF YOU ARE DOING VIEWS PLZ CHANGE -> will be /view/id or the name of the post or not*/}
                        <Route path="/view" element={<View />}></Route>
                        <Route
                            path="/edit/post/:id"
                            element={<EditPost />}
                        ></Route>
                    </Routes>
                </BrowserRouter>
            </Container>
        </div>
    );
}

export default App;
