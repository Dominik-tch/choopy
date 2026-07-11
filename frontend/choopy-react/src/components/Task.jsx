import React from "react";
import "./Task.css";
import toast from 'react-hot-toast';
import { Trash2 } from "lucide-react";
import { apiFetch, extractErrorMessage } from '../utils';

export default function Task(props) {

    async function completeTask() {
        if (!window.confirm("Are you sure you want to complete this task?")) return;
        try {
            const response = await apiFetch(`/api/tasks/${props.id}/complete`, {
                method: 'PATCH',
            });

            if (response.ok) {
                toast.success("Completed successfully!");
                props.taskReload()
            } else {
                const backendError = await extractErrorMessage(response, "Completing failed.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    async function deleteTask() {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        const toastId = `delete-${props.id}`;

        try {
            const response = await apiFetch(`/api/tasks/${props.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success("Task deleted.", { id: toastId });
                props.taskReload()
            } else {
                const backendError = await extractErrorMessage(response, "Deleting failed.");
                toast.error(backendError, { id: toastId });
            }
        } catch (err) {
            toast.error("Network error. Please try again later.", { id: toastId });
        }
    }

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
                
                {props.completionDate ? (
                    <div className="task-completed-info">
                        <span className="meta-icon">✅</span>
                        <span className="completed-date-text">
                            {new Date(props.completionDate).toLocaleDateString()}
                        </span>
                    </div>
                ) : (
                    <div className="task-actions">
                        <button className="general-btn complete-btn" onClick={completeTask}>Complete</button>
                        <button className="delete-btn" onClick={deleteTask} title="Delete Task">
                            <Trash2 size={20} />
                        </button>
                    </div>
                )}

            </div>
        </article>
    );
}