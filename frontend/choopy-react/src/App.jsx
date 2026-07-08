import React, { useState } from 'react';
import './App.css';
import LoginView from "./components/LoginView";
import Main from "./components/Main";

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

    return (
        <>
            {token ? (
                <Main onLogout={handleLogout} />
            ) : (
                <LoginView onSuccess={handleAuthSuccess} />
            )}
        </>
    );
}