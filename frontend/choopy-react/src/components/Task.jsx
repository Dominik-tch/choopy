import React, { useState } from "react";
import "./Task.css";
import toast from 'react-hot-toast';
import { Trash2, Timer, Star, SquareCheckBig, Repeat, Pencil, X } from "lucide-react";
import { apiFetch, extractErrorMessage } from '../utils';

export default function Task(props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: props.title,
        description: props.description || "",
        category: props.category,
        duration: props.duration,
        points: props.points,
        assignedTo: props.assignee && props.assignee !== "None" ? props.assignee : "None"
    });

    function toggleEdit() {
        if (isEditing) {
            setEditData({
                title: props.title,
                description: props.description || "",
                category: props.category,
                duration: props.duration,
                points: props.points,
                assignedTo: props.assignee && props.assignee !== "None" ? props.assignee : "None"
            });
        }
        setIsEditing(!isEditing);
    }

    function handleEditChange(e) {
    const { name, value } = e.target;

    setEditData(prev => ({
        ...prev,
        [name]: ["points", "duration"].includes(name)
            ? Number(value)
            : value
    }));
}

    async function handleSaveChanges() {
        if (!editData.title.trim()) {
            toast.error("Title is required.");
            return;
        }

        if (!editData.category) {
            toast.error("Category is required.");
            return;
        }

        if (editData.duration <= 0) {
            toast.error("Duration must be greater than 0.");
            return;
        }

        if (editData.points <= 0) {
            toast.error("Points must be greater than 0.");
            return;
        }
        try {
            const response = await apiFetch(`/api/tasks/${props.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });

            if (response.ok) {
                toast.success("Task updated successfully!");
                setIsEditing(false);
                props.taskReload();
            } else {
                const backendError = await extractErrorMessage(response, "Update failed.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    async function confirmTask() {
        if (!window.confirm("Are you sure you want to confirm this task?")) return;
        try {
            const response = await apiFetch(`/api/tasks/${props.id}/confirm`, { method: 'PATCH' });
            if (response.ok) {
                toast.success("Confirmed successfully!");
                props.taskReload();
            } else {
                const backendError = await extractErrorMessage(response, "Confirming failed.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error.");
        }
    }

    async function rejectTask() {
        if (!window.confirm("Are you sure you want to reject this task?")) return;
        try {
            const response = await apiFetch(`/api/tasks/${props.id}/reject`, { method: 'PATCH' });
            if (response.ok) {
                toast.success("Rejected successfully!");
                props.taskReload();
            } else {
                const backendError = await extractErrorMessage(response, "Rejecting failed.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error.");
        }
    }

    async function completeTask() {
        if (!window.confirm("Are you sure you want to complete this task?")) return;
        try {
            const response = await apiFetch(`/api/tasks/${props.id}/complete`, { method: 'PATCH' });
            if (response.ok) {
                toast.success("Completed successfully!");
                props.taskReload();
            } else {
                const backendError = await extractErrorMessage(response, "Completing failed.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error.");
        }
    }

    async function deleteTask() {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        const toastId = `delete-${props.id}`;
        try {
            const response = await apiFetch(`/api/tasks/${props.id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success("Task deleted.", { id: toastId });
                if (props.taskReload) props.taskReload();
                if (props.loadHistoryView) props.loadHistoryView(props.completedByUser.id, props.completedByUser.username);
            } else {
                const backendError = await extractErrorMessage(response, "Deleting failed.");
                toast.error(backendError, { id: toastId });
            }
        } catch (err) {
            toast.error("Network error.", { id: toastId });
        }
    }

    return (
        <article className={`task-card ${isEditing ? "editing" : ""}`}>
            
            <div className="task-card-header">
                {/* 1. Linke Seite: Der Titel */}
                <div className="header-title-area">
                    {isEditing ? (
                        <input 
                            name="title" 
                            type="text" 
                            className="inline-edit-input title-input" 
                            value={editData.title} 
                            onChange={handleEditChange} 
                        />
                    ) : (
                        <h3 className="task-title">{props.title}</h3>
                    )}
                </div>
                
                {/* 2. Rechte Seite: Kategorie und Edit-Button */}
                <div className="header-actions">
                    {isEditing ? (
                        <select 
                            name="category" 
                            className="inline-edit-input category-select" 
                            value={editData.category} 
                            onChange={handleEditChange}
                        >
                            <option value="Kitchen">Kitchen</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Trash">Trash</option>
                            <option value="Garden">Garden</option>
                            <option value="Cooking">Cooking</option>
                            <option value="Laundry">Laundry</option>
                            <option value="Driving">Driving</option>
                            <option value="Pets">Pets</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Other">Other</option>
                        </select>
                    ) : (
                        <span className="task-category">{props.category}</span>
                    )}
                    
                    {!props.generatedByScheduler && (
                        <button className="icon-edit-btn" onClick={toggleEdit} title={isEditing ? "Cancel Edit" : "Edit Task"}>
                            {isEditing ? <X size={18} /> : <Pencil size={18} />}
                        </button>
                    )}
                </div>
            </div>
            
            {isEditing ? (
                <textarea 
                    name="description" 
                    className="inline-edit-input desc-input" 
                    value={editData.description} 
                    onChange={handleEditChange} 
                    placeholder="Task description (optional)..."
                />
            ) : (
                props.description && <p className="task-description">{props.description}</p>
            )}
            
            <div className="task-meta-container">
                <div className="task-meta-badge">
                    <span className="meta-icon"><Timer size={20} /></span>
                    {isEditing ? (
                        <input name="duration" type="number" className="inline-edit-number" value={editData.duration} onChange={handleEditChange} />
                    ) : (
                        <span>{props.duration} min</span>
                    )}
                </div>
                <div className="task-meta-badge">
                    <span className="meta-icon"><Star size={20} /></span>
                    {isEditing ? (
                        <input name="points" type="number" className="inline-edit-number" value={editData.points} onChange={handleEditChange} />
                    ) : (
                        <span>{props.points} pts</span> 
                    )}
                </div>
                {props.generatedByScheduler && !isEditing && (
                    <div className="task-meta-badge">
                        <span className="meta-icon"><Repeat size={20}/></span>
                        <span>scheduled</span> 
                    </div>
                )}
                {props.confirm && !isEditing && (
                    <div className="task-meta-badge">
                        <span className="meta-icon"><SquareCheckBig size={20}/></span>
                        <span>{new Date(props.completionDate).toLocaleDateString("de-DE", {day: "numeric",month: "short"})}</span> 
                    </div>
                )}
            </div>

            <div className="task-card-footer">
                {!props.completedByUser && !isEditing ? (
                    <div className="task-assignee">
                        <span className="assignee-label">Assigned to:</span>
                        <span className="assignee-name">
                            {props.assignee && props.assignee !== "None" ? props.assignee : "Unassigned"}
                        </span>
                    </div>
                ) : null}

                {!isEditing && (
                    <>
                        {props.confirmedByUser ? (
                            <div className="task-assignee">
                                <span className="assignee-label">Confirmed by:</span>
                                <span className="assignee-name">{props.confirmedByUser.username}</span>
                            </div>
                        ) : props.loadHistoryView ? (
                            <p className="confirm-warning">Not confirmed</p>
                        ) : props.completedByUser ? (
                            <div className="task-assignee">
                                <span className="assignee-label">Completed by:</span>
                                <span className="assignee-name">{props.completedByUser.username}</span>
                            </div>
                        ) : null}
                        
                        {props.loadHistoryView ? (
                            <div className="task-actions">
                                <span className="meta-icon-check"><SquareCheckBig /></span>
                                <span className="completed-date-text">
                                    {new Date(props.completionDate).toLocaleDateString("de-DE")}
                                </span>
                                {props.role === "ADMIN" && (
                                    <button className="delete-btn" onClick={deleteTask} title="Delete Task">
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="task-actions">
                                {props.confirm ? (
                                    <>
                                        <button className="general-btn complete-btn" onClick={confirmTask}>Confirm</button>
                                        <button className="general-btn reject-btn" onClick={rejectTask}>Reject</button>
                                    </>
                                ) : (
                                    <>
                                        <button className="general-btn complete-btn" onClick={completeTask}>Complete</button>
                                        <button className="delete-btn" onClick={deleteTask} title="Delete Task">
                                            <Trash2 size={20} />
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {isEditing && (
                <div className="task-edit-footer">
                    <button className="general-btn save-btn" onClick={handleSaveChanges}>
                        Save Changes
                    </button>
                </div>
            )}
        </article>
    );
}