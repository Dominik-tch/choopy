import React from 'react';
import Task from './Task';
import toast from 'react-hot-toast';
import { apiFetch, extractErrorMessage } from '../utils';
import './TaskView.css';


export default function ConfirmView() {
    const [confirmTasks, setConfirmTasks] = React.useState(null);

    async function loadConfirmTasks() {
        const params = new URLSearchParams({ status: "OPEN" });
        try {
            const url = `/api/tasks/to-confirm`;
            const response = await apiFetch(url, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                setConfirmTasks(data);
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

    React.useEffect(() => {
            loadConfirmTasks()
        }, []);

    if (confirmTasks === null) {
        return <div className="profile-container"><p>Loading tasks...</p></div>;
    }
    
    let taskList = confirmTasks.map((task) => {
        return <Task key={task.id}
        id={task.id}
        title={task.title}
        description={task.description}
        category={task.category}
        duration={task.duration}
        points={task.points}
        assignee={task.assignedTo && task.assignedTo.username}
        taskReload={loadConfirmTasks}
        confirm={true}/>
    });

    return (
        <div className="task-page">
            <section className="task-header">
                <h1>Tasks to confirm:</h1>
                {/* <button className={`general-btn ${showCreate ? "task-inactive-btn": ""}`}
                    onClick={() => setShowCreate(prev => (!prev))}>+ Create task
                </button> */}
            </section>
            <section className="task-cards">
                {taskList}
            </section>
        </div>
    )
}