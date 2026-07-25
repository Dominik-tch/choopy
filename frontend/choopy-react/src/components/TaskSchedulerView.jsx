import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { ArrowLeft } from "lucide-react";
import { apiFetch, extractErrorMessage } from '../utils';
import ScheduledTask from "./ScheduledTask";
import "./SettingsView.css";

export default function TaskSchedulerView({ householdId, onBack }) {
    const [showCreate, setShowCreate] = useState(false);
    const [tasks, setTasks] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const weekDays = [
        { label: "Mo", value: "MONDAY" },
        { label: "Tu", value: "TUESDAY" },
        { label: "We", value: "WEDNESDAY" },
        { label: "Th", value: "THURSDAY" },
        { label: "Fr", value: "FRIDAY" },
        { label: "Sa", value: "SATURDAY" },
        { label: "Su", value: "SUNDAY" }
    ];

    const initialFormState = {
        title: "",
        description: "",
        category: "",
        duration: "",
        points: "",
        scheduledDays: []
    };

    const [formData, setFormData] = useState(initialFormState);

    async function loadScheduledTasks() {
        try {
            const response = await apiFetch(`/api/scheduled-tasks/household/${householdId}`);
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                toast.error("Failed to load scheduled tasks.");
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    useEffect(() => {
        if (householdId) {
            loadScheduledTasks();
        }
    }, [householdId]);

    function handleFormChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function toggleDay(dayValue) {
        setFormData(prev => {
            const days = prev.scheduledDays;
            if (days.includes(dayValue)) {
                return { ...prev, scheduledDays: days.filter(d => d !== dayValue) };
            } else {
                return { ...prev, scheduledDays: [...days, dayValue] };
            }
        });
    }

    function handleEditClick(task) {
        setFormData({
            title: task.title,
            description: task.description || "",
            category: task.category,
            duration: task.duration,
            points: task.points,
            scheduledDays: task.scheduledDays ? task.scheduledDays.split(",") : []
        });
        setEditingId(task.id);
        setShowCreate(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resetForm() {
        setFormData(initialFormState);
        setEditingId(null);
        setShowCreate(false);
    }

    async function handleSaveTask(e) {
        e.preventDefault();
        
        if (formData.scheduledDays.length === 0) {
            toast.error("Please select at least one day.");
            return;
        }

        const payload = {
            ...formData,
            householdId: householdId,
            scheduledDays: formData.scheduledDays.join(",")
        };

        const isEditing = editingId !== null;
        const url = isEditing ? `/api/scheduled-tasks/${editingId}` : '/api/scheduled-tasks';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await apiFetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success(isEditing ? "Updated successfully!" : "Created successfully!");
                resetForm();
                loadScheduledTasks();
            } else {
                const backendError = await extractErrorMessage(response, "Task could not be saved.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    if (tasks === null) {
        return <div className="settings-container"><p>Loading scheduler...</p></div>;
    }

    let taskList = tasks.map((task) => (
        <ScheduledTask 
            key={task.id} 
            id={task.id} 
            title={task.title} 
            description={task.description} 
            category={task.category}
            duration={task.duration} 
            points={task.points} 
            scheduledDays={task.scheduledDays}
            taskReload={loadScheduledTasks} 
            onEdit={handleEditClick}
        />
    ));

    return (
        <div className="settings-container" style={{ paddingBottom: '120px' }}>
            <div className="settings-header-row">
                <button type="button" className="back-btn" onClick={onBack}>
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="page-title" style={{ margin: 0 }}>Task Scheduler</h1>
            </div>

            <div className="task-header" style={{ marginBottom: '16px' }}>
                <button 
                    type="button" 
                    className={`general-btn ${showCreate ? "task-inactive-btn" : ""}`}
                    onClick={() => showCreate ? resetForm() : setShowCreate(true)}
                >
                    {showCreate ? "Cancel" : "+ Create Scheduled Task"}
                </button>
            </div>

            {showCreate && <section>
                <form onSubmit={handleSaveTask}>
                    <div className="input-group">
                        <label htmlFor="task-title">Title</label>
                        <input id="task-title" name="title" type="text" placeholder="Empty the trash" required 
                               value={formData.title} onChange={handleFormChange} />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="task-description">Description</label>
                        <textarea id="task-description" name="description" placeholder="Take out the black bin" 
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
                        <label htmlFor="task-duration">Duration (min)</label>
                        <input id="task-duration" name="duration" type="number" placeholder="5" required 
                                value={formData.duration} onChange={handleFormChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="task-points">Points</label>
                        <input id="task-points" name="points" type="number" placeholder="10" required 
                                value={formData.points} onChange={handleFormChange} />
                    </div>
                    
                    {/* NEU: Der Wochentags-Selector */}
                    <div className="input-group">
                        <label>Repeat on</label>
                        <div className="day-selector-row">
                            {weekDays.map(day => (
                                <button
                                    key={day.value}
                                    type="button"
                                    className={`day-btn ${formData.scheduledDays.includes(day.value) ? "active" : ""}`}
                                    onClick={() => toggleDay(day.value)}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="general-btn" style={{ marginTop: '16px' }}>
                        {editingId ? "Save Changes" : "Create Schedule"}
                    </button>
                </form>
            </section>}

            <section className="task-cards" style={{ marginTop: '24px' }}>
                {taskList.length > 0 ? taskList : <p style={{ color: 'var(--text-muted)' }}>No scheduled tasks yet.</p>}
            </section>
        </div>
    );
}