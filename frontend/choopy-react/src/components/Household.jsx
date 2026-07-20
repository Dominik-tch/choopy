import React from "react";

export default function Household(props) {

    function handleClick() {
        props.setHouseholdState(props.id);
        props.setThemeColor(props.themeColor || "#0cb954");
    }

    return (
        <button className="household-card" onClick={handleClick} style={props.themeColor ? { '--local-theme': props.themeColor } : {}}>
            <div className="household-card-header">
                <h3 className="household-name">{props.name}</h3>
                <span className="member-badge">{props.memberCount} Members</span>
            </div>
            
            <div className="invite-section">
                <span className="invite-label">Invite Code</span>
                <span className="invite-code">{props.inviteCode}</span>
            </div>
        </button>
    );
}