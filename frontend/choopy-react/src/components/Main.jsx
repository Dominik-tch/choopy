import React from 'react';
import { User, House, Home, CheckSquare, Settings, Users, ShoppingCart, BookCheck } from "lucide-react";
import Navbar from './Navbar';
import ProfileView from './ProfileView';
import HouseholdView from './HouseholdView';
import MemberView from './MemberView';
import TaskView from './TaskView';
import ShoppingView from './ShoppingView';
import SettingsView from './SettingsView';
import ConfirmView from './ConfirmView';

export default function Main(props) {
    const [householdState, setHouseholdState] = React.useState(null)
    const [view, setView] = React.useState("house")
    const [householdView, setHouseholdView] = React.useState("tasks")
    const [themeColor, setThemeColor] = React.useState("#0cb954");

    React.useEffect(() => {
        document.documentElement.style.setProperty('--theme-primary', themeColor);
    }, [themeColor]);

    React.useEffect(() => {
        if (!householdState) {
            setThemeColor("#0cb954");
        }
    }, [householdState]);

    const generalNavbar = [
        {
            id: "house",
            label: "House",
            icon: House
        },
        {
            id: "confirmations",
            label: "Confirmations",
            icon: BookCheck
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
        id: "shoppingList",
        label: "List",
        icon: ShoppingCart
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
                {view === "house" && <HouseholdView setHouseholdState={setHouseholdState} setThemeColor={setThemeColor}/>}
                {view === "profile" && <ProfileView onLogout={props.onLogout}/>}
                {view === "confirmations" && <ConfirmView />}
                </div>
                <Navbar items={generalNavbar} viewState={view} viewHandler={setView}/>
            </>) : (
            <>
                <div className="main-content">
                    {householdView === "members" && <MemberView householdId={householdState}/>}
                    {householdView === "shoppingList" && <ShoppingView householdId={householdState}/>}
                    {householdView === "tasks" && <TaskView householdId={householdState}/>}
                    {householdView === "settings" && <SettingsView householdId={householdState}/>}
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