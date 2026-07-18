import React from "react";
import toast from 'react-hot-toast';
import { ArrowLeft } from "lucide-react";
import { apiFetch, extractErrorMessage } from '../utils';
import './MemberView.css';
import Task from "./Task";

function Member(props) {
    return (
        <button onClick={() => props.loadHistoryView(props.memberId, props.username)} className="member-card">
            <p className="member-username">{props.username}</p>
            <div className="member-score-badge">
                <span className="score-label">Score</span>
                <span className="score-value">{props.score}</span>
            </div>
        </button>
    );
}

export default function MemberView({ householdId }) {
    const [members, setMembers] = React.useState([]);
    const [historyMemberName, setHistoryMemberName] = React.useState(null);
    const [historyTasks, setHistoryTasks] = React.useState([]);
    const [role, setRole] = React.useState(null);

    React.useEffect(() => {
        const handlePopState = (event) => {
        if (historyMemberName) {
            setHistoryMemberName(null);
            setHistoryTasks([]);
        }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
        window.removeEventListener('popstate', handlePopState);
        };
    }, [historyMemberName]);

    async function fetchUserRole() {
        try {
            const response = await apiFetch(`/api/households/${householdId}/role`, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                setRole(data.role);
            } else {
                const backendError = await extractErrorMessage(
                    response,
                    "Failed to fetch user role."
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

    async function loadHistoryView(memberId, memberName) {
        setHistoryMemberName(memberName)
        window.history.pushState({ HistoryViewOpen: true }, '');

        const params = new URLSearchParams({ status: "COMPLETED", completedByUserId: memberId });
        try {
            const url = `/api/households/${householdId}/tasks?${params.toString()}`;
            const response = await apiFetch(url, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                setHistoryTasks(data);
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
        loadMembers();
        fetchUserRole();
    }, []);

    const memberList = members.map((member) => (
        <Member
        key={member.id}
        memberId={member.id}
        username={member.username}
        score={member.score}
        loadHistoryView={loadHistoryView}
        />
    ));

    let historyTaskList = historyTasks.map((task) => (
        <Task
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            category={task.category}
            duration={task.duration}
            points={task.points}
            assignee={task.assignedTo && task.assignedTo.username}
            completionDate={task.completionDate}
            role={role}
            loadHistoryView={loadHistoryView}
            completedByUser={task.completedBy}
            confirmedByUser={task.confirmedBy}
        />
    ));

    function handleBackButton() {
        setHistoryMemberName(null);
        setHistoryTasks([]);
        window.history.back();
    }

    return (
        <>
            {historyMemberName == null ? (
            <div className="member-view-container">
                <h1 className="page-title">Members</h1>
                <section className="member-list">
                    {memberList}
                </section>
            </div>
            ) : (
            <div className="history-view-container">
                <div className="history-header">
                    <button className="back-btn" onClick={handleBackButton}><ArrowLeft size={20}/></button>
                    <h1 className="page-title">{`${historyMemberName}'s task history:`}</h1>
                </div>
                <section className="history-task-list">
                    {historyTaskList.length > 0 ? historyTaskList : <p>No completed tasks found.</p>}
                </section>
            </div>
            
            )}
        </>
    );
}