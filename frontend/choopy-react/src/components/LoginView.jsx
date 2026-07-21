import React, { useState } from "react";
import toast from 'react-hot-toast';
import './LoginView.css';
import { apiFetch, extractErrorMessage } from '../utils';

// Added onSuccess prop to trigger the state change in App.jsx
export default function LoginView({ onSuccess }) {
    const [showLogin, setLoginState] = useState(true);

    async function handleLogin(formData) {
        const data = Object.fromEntries(formData);
        //console.log(`Formdata : ${JSON.stringify(data)}`)
        try {
            const response = await apiFetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                toast.success("Logged in successfully!");
                onSuccess(result.token);
            } else {
                const backendError = await extractErrorMessage(response, "Invalid username or password.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    async function handleRegister(formData) {
        const data = Object.fromEntries(formData);
        //console.log(`Formdata : ${JSON.stringify(data)}`)
        
        try {
            const response = await apiFetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                toast.success("Registered successfully!");
                onSuccess(result.token);
            } else {
                const backendError = await extractErrorMessage(response, "Registration failed.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    return (
        <div className="login-container">
            <div className="toggle-container">
                <button
                    className={`toggle-btn ${showLogin ? "active" : ""}`}
                    onClick={() => setLoginState(true)}
                    type="button">Login</button>
                <button
                    className={`toggle-btn ${!showLogin ? "active" : ""}`}
                    onClick={() => setLoginState(false)}
                    type="button">Register</button>
            </div>

            {showLogin ? (
                <form action={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="login-username">Username</label>
                        <input id="login-username" name="username" type="text" placeholder="max123" required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="login-password">Password</label>
                        <input id="login-password" name="password" type="password" placeholder="••••••••" required />
                    </div>

                    <button type="submit" className="general-btn">
                        Login
                    </button>
                </form>
            ) : (
                <form action={handleRegister}>
                    <div className="input-group">
                        <label htmlFor="reg-username">Username</label>
                        <input id="reg-username" name="username" type="text" placeholder="max123" required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="reg-fullname">Full name</label>
                        <input id="reg-fullname" name="fullname" type="text" placeholder="Max Mustermann" required/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="reg-email">Email</label>
                        <input id="reg-email" name="email" type="email" placeholder="max123@gmail.com" required/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="reg-password">Password</label>
                        <input id="reg-password" name="password" type="password" placeholder="••••••••" required />
                    </div>

                    <button type="submit" className="general-btn">
                        Register
                    </button>
                </form>
            )}
        </div>
    );
}