import React, { useState } from "react";
import "./UpdateNotification.css";
import Edit from "../assets/Edit.png";
import Kategorien from "../assets/Kategorien.png"
import Schedule from "../assets/Schedule.png"
import Settings from "../assets/Settings.png"
import Shopping from "../assets/Shopping.png"
export default function UpdateNotification() {
    const [show, setShow] = useState(() => {
        return localStorage.getItem("update_seen_v2") !== "true";
    });

    function closeNotification() {
        localStorage.setItem("update_seen_v2", "true");
        setShow(false);
    }

    if (!show) {
        return null;
    }

    return (
        <div className="update-overlay">
            <div className="update-card">
                <h2>🎉 Big new update</h2>

                <p style={{ fontSize: "22px", fontWeight: "600" }}>Wichtige Änderungen:</p>

                <div className="update-feature">
                    <h3>Neuer Scheduler in den Settings:</h3>
                    <img src={Settings} alt="Recent button update" />
                </div>

                <div className="update-feature">
                    <h3>Definiere Aufgaben die an definierten Wochentagen immer wieder erscheinen:</h3>
                    <img src={Schedule} alt="More button update" />
                </div>

                <div className="update-feature">
                    <h3>Nach Kategorien filtern!</h3>
                    <img src={Kategorien} alt="More button update" />
                </div>

                <div className="update-feature">
                    <h3>Klick auf den Stift und bearbeite die Eigenschaften vom Task direkt:</h3>
                    <img src={Edit} alt="More button update" />
                </div>

                <div className="update-feature">
                    <h3>Länger gedrückt halten auf einen Artikel lässt ihn bearbeiten:</h3>
                    <img src={Shopping} alt="More button update" />
                </div>

                <button 
                    className="general-btn"
                    onClick={closeNotification}
                >
                    Got it
                </button>
            </div>
        </div>
    );
}