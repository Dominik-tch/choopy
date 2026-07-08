import React from "react";
import toast from 'react-hot-toast';
import './ProfileView.css';
import { apiFetch, extractErrorMessage } from '../utils';

export default function ProfileView({ onLogout }) {
    const [userProfile, setUserProfile] = React.useState(null);
    const [isSaving, setIsSaving] = React.useState(false);

    async function loadProfile() {
        try {
            const response = await apiFetch(`/api/users`, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                setUserProfile(data);
            } else {
                const backendError = await extractErrorMessage(
                    response,
                    "Failed to get user information."
                );
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    React.useEffect(() => {
        loadProfile();
    }, []);

    async function handleEdit(formData) {
        setIsSaving(true);
        const data = Object.fromEntries(formData);
        console.log("Updated data ready to send:", data);
        try {
            const response = await apiFetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                toast.success("Saved successfully!");
                loadProfile();
            } else {
                const backendError = await extractErrorMessage(response, "Editing has failed.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        } finally {
            setIsSaving(false);
        }
    }

    // Show a simple loading message until the backend responds
    if (!userProfile) {
        return <div className="profile-container"><p>Loading profile...</p></div>;
    }

    return (
        <div className='profile-container'>
            <form action={handleEdit}>
                <div className="input-group">
                    <label htmlFor="edit-username">Username</label>
                    <input id="edit-username" name="username" type="text" placeholder="max123" defaultValue={userProfile.username} required />
                </div>

                <div className="input-group">
                    <label htmlFor="edit-fullname">Full name</label>
                    <input id="edit-fullname" name="fullname" type="text" placeholder="Max Mustermann" defaultValue={userProfile.fullname}/>
                </div>

                <div className="input-group">
                    <label htmlFor="edit-email">Email</label>
                    <input id="edit-email" name="email" type="email" placeholder="max123@gmail.com" defaultValue={userProfile.email}/>
                </div>

                {/* <div className="input-group">
                    <label htmlFor="edit-password">New Password (Optional)</label>
                    <input id="edit-password" name="password" type="password" placeholder="••••••••" />
                </div> */}

                <button type="submit" className="general-btn" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </form>
            
            {/* Kept your logout button */}
            <button className='general-btn logout-btn' onClick={onLogout} style={{ marginTop: '20px', backgroundColor: '#ef4444' }}>
                Logout
            </button>
        </div>
    );
}