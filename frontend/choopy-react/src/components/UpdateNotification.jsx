import React, { useState } from "react";
import "./UpdateNotification.css";

import RecentImg from "../assets/Update_Img_Recent.png";
import MoreImg from "../assets/Update_Img_More.png";
import MoreImg2 from "../assets/Update_Img_More_2.png";

export default function UpdateNotification() {
    const [show, setShow] = useState(() => {
        return localStorage.getItem("update_seen_v1") !== "true";
    });

    function closeNotification() {
        localStorage.setItem("update_seen_v1", "true");
        setShow(false);
    }

    if (!show) {
        return null;
    }

    return (
        <div className="update-overlay">
            <div className="update-card">
                <h2>🎉 New update</h2>

                <p>Hier ist, was sich geändert hat:</p>

                <div className="update-feature">
                    <h3>Neuer Recent Button für mehr Optionalität:</h3>
                    <img src={RecentImg} alt="Recent button update" />
                </div>

                <div className="update-feature">
                    <h3>Neuer Show more Button für noch mehr zuletzt erstellte tasks:</h3>
                    <img src={MoreImg} alt="More button update" />
                    <img src={MoreImg2} alt="More button expanded view" />
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