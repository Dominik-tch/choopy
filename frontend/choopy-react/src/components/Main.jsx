import React from 'react';
import { User, House, Home, CheckSquare, Settings, Users } from "lucide-react";
import Navbar from './Navbar';
import ProfileView from './ProfileView';
import HouseholdView from './HouseholdView';
import MemberView from './MemberView';
import TaskView from './TaskView';

export default function Main(props) {
    const [householdState, setHouseholdState] = React.useState(null)
    const [view, setView] = React.useState("house")
    const [householdView, setHouseholdView] = React.useState("tasks")
    const generalNavbar = [
        {
            id: "house",
            label: "House",
            icon: House
        },
        {
            id: "profile",
            label: "Profile",
            icon: User
        }
    ];
    const householdNavbar = [
    {
        id: "home",
        label: "Home",
        icon: Home
    },
    {
        id: "tasks",
        label: "Tasks",
        icon: CheckSquare
    },
    {
        id: "members",
        label: "Members",
        icon: Users
    },
    {
        id: "settings",
        label: "Settings",
        icon: Settings
    }
];

    return (
        <>
            {!householdState ? (
            <>
                <div className="main-content">
                {view === "house" && <HouseholdView setHouseholdState={setHouseholdState}/>}
                {view === "profile" && <ProfileView onLogout={props.onLogout}/>}
                </div>
                <Navbar items={generalNavbar} viewState={view} viewHandler={setView}/>
            </>) : (
            <>
                <div className="main-content">
                    {householdView === "members" && <MemberView householdId={householdState}/>}
                    {householdView === "tasks" && <TaskView householdId={householdState}/>}
                </div>
                <Navbar items={householdNavbar}
                        viewState={householdView}
                        viewHandler={setHouseholdView}
                        setHouseholdState={setHouseholdState}
                        />
            </>
            )}
        </>

    );
}