import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './views/Home/Home';
import UserDetail from './views/UserAccount/UserAccount';
import { Container } from '@mui/material';
import ConnectionContextProvider from './components/Contexts/connectionContext';
import CollectionPage from './views/Admin/CollectionPage';
import CollectionListPage from './views/Admin/CollectionListPage';

function App() {
    return (
        <ConnectionContextProvider>
            <Container component="div" className="App" maxWidth="md">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/account/:id" element={<UserDetail />} />
                        <Route
                            path="/admin/collection/:collectionName"
                            element={<CollectionPage />}
                        />
                        <Route
                            path="/admin/"
                            element={<CollectionListPage />}
                        />
                    </Routes>
                </BrowserRouter>
            </Container>
        </ConnectionContextProvider>
    );
}

export default App;
