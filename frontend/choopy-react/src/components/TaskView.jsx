import React from "react";
import toast from 'react-hot-toast';
import { apiFetch, extractErrorMessage } from '../utils';
import Task from "./Task";
import "./TaskView.css";

export default function TaskView({ householdId }) {
    const [showCreate, setShowCreate] = React.useState(false);
    const [members, setMembers] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);

    async function loadTasks() {
        try {
            const response = await apiFetch(`/api/households/${householdId}/tasks`, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                setTasks(data);
                console.log(data)
            } else {
                const backendError = await extractErrorMessage(
                    response,
                    "Failed to load tasks."
                );
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    async function loadMembers() {
        try {
            const response = await apiFetch(`/api/households/${householdId}/members`, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                setMembers(data);
            } else {
                const backendError = await extractErrorMessage(
                    response,
                    "Failed to load members."
                );
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    React.useEffect(() => {
        loadMembers();
        loadTasks()
    }, [householdId]);

    let memberList = members.map((member) => {
        return <option key={member.id} value={member.username}>{member.username}</option>
    });

    let taskList = tasks.map((task) => {
        return <Task key={task.id} id={task.id} title={task.title} description={task.description} category={task.category}
                duration={task.duration} points={task.points} assignee={task.assignedTo && task.assignedTo.username}/>
    });

    async function createTask(formData) {
        const data = Object.fromEntries(formData);

        try {
            const response = await apiFetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({...data, householdId: householdId})
            });

            if (response.ok) {
                const result = await response.json();
                toast.success("Created successfully!");
                loadTasks()
            } else {
                const backendError = await extractErrorMessage(response, "Task could not be created.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    return (
        <div className="task-page">
            <section className="task-header">
                <h1>Create or complete a Task:</h1>
                <button className={`general-btn ${showCreate ? "task-inactive-btn": ""}`}
                    onClick={() => setShowCreate(prev => (!prev))}>+ Create task
                </button>
            </section>
            {showCreate && <section>
                <form action={createTask}>
                        <div className="input-group">
                            <label htmlFor="task-title">Title</label>
                            <input id="task-title" name="title" type="text" placeholder="Unload the dishwasher" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="task-description">Description</label>
                            <textarea id="task-description" name="description" placeholder="Dont forget the small plates!"/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="task-category">Category</label>
                            <select id="task-category" name="category" defaultValue="" required>
                                <option value="" disabled>-- Choose a category --</option>
                                <option value="Kitchen">Kitchen</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Trash">Trash</option>
                                <option value="Garden">Garden</option>
                                <option value="Cooking">Cooking</option>
                                <option value="Laundry">Laundry</option>
                                <option value="Driving">Driving</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="task-duration">Duration</label>
                            <input id="task-duration" name="duration" type="number" placeholder="5" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="task-points">Points</label>
                            <input id="task-points" name="points" type="number" placeholder="10" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="task-assignee">Assigned to</label>
                            <select id="task-assignee" name="assignedTo">
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
    )
}