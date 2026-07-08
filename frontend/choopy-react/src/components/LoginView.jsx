import React, { useState } from "react";
import './LoginView.css';

// Added onSuccess prop to trigger the state change in App.jsx
export default function LoginView({ onSuccess }) {
    const [showLogin, setLoginState] = useState(true);
    const [error, setError] = useState(null);
    console.log("login rendered")
    async function handleLogin(formData) {
        setError(null);
        const data = Object.fromEntries(formData);
        console.log(`Formdata : ${JSON.stringify(data)}`)
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                onSuccess(result.token);
            } else {
                setError("Invalid username or password.");
            }
        } catch (err) {
            setError("Network error. Please try again later.");
        }
    }

    async function handleRegister(formData) {
        setError(null);
        const data = Object.fromEntries(formData);
        console.log(`Formdata : ${JSON.stringify(data)}`)
        
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                onSuccess(result.token);
            } else {
                setError("Registration failed. Username might be taken.");
            }
        } catch (err) {
            setError("Network error. Please try again later.");
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

            {/* Simple error display */}
            {error && <div style={{ color: '#ef4444', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

            {showLogin ? (
                <form action={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="login-username">Username</label>
                        {/* Added name="username" */}
                        <input id="login-username" name="username" type="text" placeholder="max123" required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="login-password">Password</label>
                        {/* Added name="password" */}
                        <input id="login-password" name="password" type="password" placeholder="••••••••" required />
                    </div>

                    <button type="submit" className="submit-btn">
                        Login
                    </button>
                </form>
            ) : (
                <form action={handleRegister}>
                    <div className="input-group">
                        <label htmlFor="reg-username">Username</label>
                        {/* Added name="username" */}
                        <input id="reg-username" name="username" type="text" placeholder="max123" required />
                    </div>

                    {/* Note: Ensure your Spring backend User model supports fullname/email if you are sending them, 
                        or remove them from the payload before sending if they aren't mapped. */}
                    <div className="input-group">
                        <label htmlFor="reg-fullname">Full name</label>
                        {/* Added name="fullname" */}
                        <input id="reg-fullname" name="fullname" type="text" placeholder="Max Mustermann"/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="reg-email">Email</label>
                        {/* Added name="email" */}
                        <input id="reg-email" name="email" type="email" placeholder="max123@gmail.com"/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="reg-password">Password</label>
                        {/* Added name="password" */}
                        <input id="reg-password" name="password" type="password" placeholder="••••••••" required />
                    </div>

                    <button type="submit" className="submit-btn">
                        Register
                    </button>
                </form>
            )}
        </div>
    );
}