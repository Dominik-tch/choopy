import React from "react";

export default function Household(props) {
    return (
        <div className="household-card">
            <div className="household-card-header">
                <h3 className="household-name">{props.name}</h3>
                <span className="member-badge">{props.memberCount} Members</span>
            </div>
            
            <div className="invite-section">
                <span className="invite-label">Invite Code</span>
                <span className="invite-code">{props.inviteCode}</span>
            </div>
        </div>
    );
}