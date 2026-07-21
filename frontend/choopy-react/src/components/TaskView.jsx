import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { apiFetch, extractErrorMessage } from '../utils';
import Task from "./Task";
import "./TaskView.css";

export default function TaskView({ householdId }) {
    const [showCreate, setShowCreate] = useState(false);
    const [members, setMembers] = useState([]);
    const [tasks, setTasks] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    const initialFormState = {
        title: "",
        description: "",
        category: "",
        duration: "",
        points: "",
        assignedTo: "None"
    };
    const [formData, setFormData] = useState(initialFormState);

    async function loadTasks() {
        const params = new URLSearchParams({ status: "OPEN" });
        try {
            const response = await apiFetch(`/api/households/${householdId}/tasks?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                const backendError = await extractErrorMessage(response, "Failed to load tasks.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    async function loadMembers() {
        try {
            const response = await apiFetch(`/api/households/${householdId}/members`);
            if (response.ok) {
                const data = await response.json();
                setMembers(data);
            } else {
                const backendError = await extractErrorMessage(response, "Failed to load members.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    async function loadSuggestions() {
        try {
            const response = await apiFetch(`/api/households/${householdId}/tasks/suggestions`);
            if (response.ok) {
                const data = await response.json();
                setSuggestions(data);
            }
        } catch (err) {
            console.error("Failed to load task suggestions.");
        }
    }

    useEffect(() => {
        if (householdId) {
            loadMembers();
            loadTasks();
            loadSuggestions();
        }
    }, [householdId]);

    function handleFormChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleSuggestionClick(task) {
        setFormData({
            title: task.title || "",
            description: task.description || "",
            category: task.category || "",
            duration: task.duration || "",
            points: task.points || "",
            assignedTo: task.assignedTo ? task.assignedTo.username : "None"
        });
        setShowCreate(true);
    }

    async function handleCreateTask(e) {
        e.preventDefault();
        try {
            const response = await apiFetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, householdId: householdId })
            });

            if (response.ok) {
                toast.success("Created successfully!");
                setFormData(initialFormState);
                setShowCreate(false);
                loadTasks();
                loadSuggestions();
            } else {
                const backendError = await extractErrorMessage(response, "Task could not be created.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    if (tasks === null) {
        return <div className="profile-container"><p>Loading tasks...</p></div>;
    }

    let memberList = members.map((member) => (
        <option key={member.id} value={member.username}>{member.username}</option>
    ));

    let taskList = tasks.map((task) => (
        <Task key={task.id} id={task.id} title={task.title} description={task.description} category={task.category}
            duration={task.duration} points={task.points} assignee={task.assignedTo && task.assignedTo.username} taskReload={loadTasks} />
    ));

    return (
        <div className="task-page">
            <section className="task-header">
                <h1>Create or complete a Task:</h1>
                <button className={`general-btn ${showCreate ? "task-inactive-btn" : ""}`}
                    onClick={() => setShowCreate(prev => (!prev))}>+ Create task
                </button>
            </section>

            {suggestions.length > 0 && (
                <div className="task-suggestions-container">
                    <span className="suggestions-label">Recent:</span>
                    <div className="task-suggestions-list">
                        {suggestions.map((task) => (
                            <button 
                                key={task.id} 
                                type="button" 
                                className="suggestion-chip"
                                onClick={() => handleSuggestionClick(task)}
                            >
                                {task.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {showCreate && <section>
                <form onSubmit={handleCreateTask}>
                    <div className="input-group">
                        <label htmlFor="task-title">Title</label>
                        <input id="task-title" name="title" type="text" placeholder="Unload the dishwasher" required 
                               value={formData.title} onChange={handleFormChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="task-description">Description</label>
                        <textarea id="task-description" name="description" placeholder="Dont forget the small plates!" 
                                  value={formData.description} onChange={handleFormChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="task-category">Category</label>
                        <select id="task-category" name="category" required 
                                value={formData.category} onChange={handleFormChange}>
                            <option value="" disabled>-- Choose a category --</option>
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
                    </div>
                    <div className="input-group">
                        <label htmlFor="task-duration">Duration</label>
                        <input id="task-duration" name="duration" type="number" placeholder="5" required 
                               value={formData.duration} onChange={handleFormChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="task-points">Points</label>
                        <input id="task-points" name="points" type="number" placeholder="10" required 
                               value={formData.points} onChange={handleFormChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="task-assignee">Assigned to</label>
                        <select id="task-assignee" name="assignedTo" 
                                value={formData.assignedTo} onChange={handleFormChange}>
                            <option value="None">Unassigned</option>
                            {memberList}
                        </select>
                    </div>
                    <button type="submit" className="general-btn">
                        Create
                    </button>
                </form>
            </section>}

            <section className="task-cards">
                {taskList}
            </section>
        </div>
    );
}