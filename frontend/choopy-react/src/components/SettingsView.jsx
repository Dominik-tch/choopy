import React, { useState, useEffect } from "react";
import { Settings, Repeat } from "lucide-react";
import HouseholdSettingsView from "./HouseholdSettingsView";
import TaskSchedulerView from "./TaskSchedulerView.jsx";
import "./SettingsView.css";

export default function SettingsView({ householdId }) {
    const [activeSetting, setActiveSetting] = useState(null);

    useEffect(() => {
        const handlePopState = () => {
            if (activeSetting) {
                setActiveSetting(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [activeSetting]);

    function openSetting(settingName) {
        setActiveSetting(settingName);
        window.history.pushState({ settingOpen: true }, '');
    }

    function handleBack() {
        setActiveSetting(null);
        window.history.back();
    }

    if (activeSetting === "household") {
        return <HouseholdSettingsView householdId={householdId} onBack={handleBack} />;
    }

    if (activeSetting === "scheduler") {
        return <TaskSchedulerView householdId={householdId} onBack={handleBack} />;
    }

    return (
        <div className="settings-container">
            <h1 className="page-title">Settings</h1>
            
            <div className="settings-menu">
                <button className="settings-menu-btn" onClick={() => openSetting("household")}>
                    <div className="menu-btn-content">
                        <Settings size={24} className="menu-icon" />
                        <span>Household Details & Theme</span>
                    </div>
                </button>
                
                <button className="settings-menu-btn" onClick={() => openSetting("scheduler")}>
                    <div className="menu-btn-content">
                        <Repeat size={24} className="menu-icon" />
                        <span>Recurring Tasks (Scheduler)</span>
                    </div>
                </button>
            </div>
        </div>
    );
}