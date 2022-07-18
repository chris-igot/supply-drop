import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './views/Home/Home';
import UserDetail from './views/UserAccount/UserAccount';
import { Container } from '@mui/material';

function App() {
    return (
        <Container component="div" className="App" maxWidth="md">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/account/:id" element={<UserDetail />}></Route>
                </Routes>
            </BrowserRouter>
        </Container>
    );
}

export default App;
