import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './views/Home/Home';
import UserDetail from './views/UserAccount/UserAccount';
import { Container } from '@mui/material';

function App() {
    return (
        <div className="App">
            <Container maxWidth="md">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />}></Route>
                        {/* IF YOU ARE DOING ACCOUNT PLZ CHANGE -> will be /account/id try to make id into the username if you can or not */}
                        <Route
                            path="/account/:id"
                            element={<UserDetail />}
                        ></Route>
                    </Routes>
                </BrowserRouter>
            </Container>
        </div>
    );
}

export default App;
