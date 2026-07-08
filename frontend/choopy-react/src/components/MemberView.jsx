import React from "react";
import toast from 'react-hot-toast'; // Added missing import
import { apiFetch, extractErrorMessage } from '../utils';
import './MemberView.css'; // Don't forget to import the CSS

function Member(props) {
    return (
        <article className="member-card">
            <p className="member-username">{props.username}</p>
            <div className="member-score-badge">
                <span className="score-label">Score</span>
                <span className="score-value">{props.score}</span>
            </div>
        </article>
    );
}

export default function MemberView({ householdId }) {
    const [members, setMembers] = React.useState([]);

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
    }, []);

    let memberList = members.map((member) => {
        return <Member key={member.id} username={member.username} score={member.score} />
    });

    return (
        <div className="member-view-container">
            <h1 className="page-title">Members</h1>
            <section className="member-list">
                {memberList}
            </section>
        </div>
    );
}