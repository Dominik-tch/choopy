import React from "react";
import "./Task.css";

export default function Task(props) {
    return (
        <article className="task-card">
            <div className="task-card-header">
                <h3 className="task-title">{props.title}</h3>
                <span className="task-category">{props.category}</span>
            </div>
            
            {props.description && (
                <p className="task-description">{props.description}</p>
            )}
            
            <div className="task-meta-container">
                <div className="task-meta-badge">
                    <span className="meta-icon">⏱️</span>
                    <span>{props.duration} min</span>
                </div>
                <div className="task-meta-badge points-badge">
                    <span className="meta-icon">⭐</span>
                    <span>{props.points} pts</span> 
                </div>
            </div>

            <div className="task-card-footer">
                <div className="task-assignee">
                    <span className="assignee-label">Assigned to:</span>
                    <span className="assignee-name">
                        {props.assignee && props.assignee !== "None" ? props.assignee : "Unassigned"}
                    </span>
                </div>
                
                <button className="general-btn complete-btn">
                    Complete
                </button>
            </div>
        </article>
    );
}