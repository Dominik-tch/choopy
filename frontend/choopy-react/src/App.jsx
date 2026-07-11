import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import LoginView from "./components/LoginView";
import Main from "./components/Main";
import Header from "./components/Header"

export default function App() {
    // Check localStorage for an existing token on initial load
    const [token, setToken] = useState(localStorage.getItem('jwt_token') || null);

    const handleAuthSuccess = (newToken) => {
        localStorage.setItem('jwt_token', newToken); // Save token for future visits
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        setToken(null);
    };

    useEffect(() => {
        function handleAuthExpired() {
            handleLogout();
            Toaster.error("Session expired. Please log in again.");
        };

        window.addEventListener('auth-expired', handleAuthExpired);

        return () => window.removeEventListener('auth-expired', handleAuthExpired);
    }, []);


    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <Header />
            {token ? (
                <Main onLogout={handleLogout} />
            ) : (
                <LoginView onSuccess={handleAuthSuccess} />
            )}
        </>
    );
}