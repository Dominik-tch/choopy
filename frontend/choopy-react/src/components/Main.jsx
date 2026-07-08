import React from 'react';

export default function Main({ onLogout }) {
    return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
            <h2>Welcome to Choopy!</h2>
            <p>You have successfully authenticated.</p>
            <button 
                onClick={onLogout}
                style={{
                    marginTop: '20px',
                    padding: '12px 24px',
                    backgroundColor: '#ef4444', // Red for logout
                    color: 'white',
                    border: 'none',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                Logout
            </button>
        </div>
    );
}