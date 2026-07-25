import React from "react";
import "./Task.css";
import toast from 'react-hot-toast';
import { Trash2, Timer, Star, Pencil, CalendarClock } from "lucide-react";
import { apiFetch, extractErrorMessage } from '../utils';

export default function ScheduledTask(props) {

    const dayMap = { 
        MONDAY: "Mo", TUESDAY: "Tu", WEDNESDAY: "We", 
        THURSDAY: "Th", FRIDAY: "Fr", SATURDAY: "Sa", SUNDAY: "Su" 
    };
    
    const formattedDays = props.scheduledDays
        ? props.scheduledDays.split(",").map(d => dayMap[d]).join(", ")
        : "None";

    async function deleteScheduledTask() {
        if (!window.confirm("Are you sure you want to delete this scheduled task? Future tasks will no longer be generated.")) return;

        const toastId = `delete-sched-${props.id}`;

        try {
            const response = await apiFetch(`/api/scheduled-tasks/${props.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success("Scheduled task deleted.", { id: toastId });
                if (props.taskReload) props.taskReload();
            } else {
                const backendError = await extractErrorMessage(response, "Deleting failed.");
                toast.error(backendError, { id: toastId });
            }
        } catch (err) {
            toast.error("Network error. Please try again.", { id: toastId });
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
                    <span className="meta-icon"><Timer size={20} /></span>
                    <span>{props.duration} min</span>
                </div>
                <div className="task-meta-badge">
                    <span className="meta-icon"><Star size={20} /></span>
                    <span>{props.points} pts</span> 
                </div>
            </div>

            <div className="task-card-footer">
                <div className="task-assignee">
                    <span className="assignee-label"><CalendarClock size={16} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px'}}/> Repeats on:</span>
                    <span className="assignee-name" style={{ color: 'var(--theme-primary)' }}>
                        {formattedDays}
                    </span>
                </div>
                
                <div className="task-actions">
                    <button className="general-btn complete-btn edit-btn" onClick={() => props.onEdit(props)}>
                        <Pencil size={16} /> Edit
                    </button>
                    <button className="delete-btn" onClick={deleteScheduledTask} title="Delete Scheduled Task">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </article>
    );
}