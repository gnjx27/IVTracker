import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IVSurface from './pages/IVSurface';
import Trackers from './pages/Trackers';
import About from './pages/About';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { RegisterModalProvider } from './contexts/RegisterModalContext';
import { LoginModalProvider } from './contexts/LoginModalContext';

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <RegisterModalProvider>
                    <LoginModalProvider>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<IVSurface />} />
                                <Route index path="iv-surface" element={<IVSurface />} />
                                <Route path="trackers" element={<Trackers />} />
                                <Route path="about" element={<About />} />
                            </Route>
                        </Routes>
                    </LoginModalProvider>
                </RegisterModalProvider>
            </AuthProvider>
        </Router>
    );
}
