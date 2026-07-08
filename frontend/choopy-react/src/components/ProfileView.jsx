import './ProfileView.css';

export default function ProfileView({ onLogout }) {


    function handleEdit() {

    }

    return (
        <div className='profile-container'>
            <form action={handleEdit}>
                <div className="input-group">
                    <label htmlFor="edit-username">Username</label>
                    <input id="edit-username" name="username" type="text" placeholder="max123" required />
                </div>

                <div className="input-group">
                    <label htmlFor="edit-fullname">Full name</label>
                    <input id="edit-fullname" name="fullname" type="text" placeholder="Max Mustermann"/>
                </div>

                <div className="input-group">
                    <label htmlFor="edit-email">Email</label>
                    <input id="edit-email" name="email" type="email" placeholder="max123@gmail.com"/>
                </div>

                <div className="input-group">
                    <label htmlFor="edit-password">Password</label>
                    <input id="edit-password" name="password" type="password" placeholder="••••••••" required />
                </div>

                <button type="submit" className="general-btn">
                    Edit
                </button>
            </form>
            <button className='general-btn logout-btn' onClick={onLogout}>Logout</button>
        </div>
    )
}


