import React from 'react';
import Navbar from './Navbar';
import ProfileView from './ProfileView';
import HouseholdView from './HouseholdView';

export default function Main(props) {
    const [view, setView] = React.useState("house")

    return (
        <>
            <div className="main-content">
                {view === "house" && <HouseholdView />}
                {view === "profile" && <ProfileView onLogout={props.onLogout}/>}
            </div>
            <Navbar viewState={view} viewHandler={setView}/>
        </>
    );
}