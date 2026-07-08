import React from "react";
import toast from 'react-hot-toast';
import Household from "./Household";
import "./HouseholdView.css";
import { apiFetch } from '../utils';


export default function({setView, setHouseholdState}) {
    const [showCreate, setShowCreate] = React.useState(false);
    const [households, setHouseholds] = React.useState([]);
    
    async function loadHouseholds() {
        try {
            const response = await apiFetch('/api/households/details', {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                setHouseholds(data);
                //console.log(`Recived Household List: ${data}`)
            } else {
                const backendError = await extractErrorMessage(
                    response,
                    "Failed to load households."
                );
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    React.useEffect(() => {
        loadHouseholds();
    }, []);

    async function createHousehold(formData) {
        const data = Object.fromEntries(formData);

        try {
            const response = await apiFetch('/api/households', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                toast.success("Created successfully!");
            } else {
                const backendError = await extractErrorMessage(response, "Household already exist");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
        loadHouseholds();
    }

    let householdList = households.map((item) => {
        return <Household key={item.id} setHouseholdState={setHouseholdState} id={item.id} name={item.name} memberCount={item.memberCount} inviteCode={item.inviteCode}/>
    })

    return (
        <div className="household-page">
    <section className="household-header">
        <h1>Create/Join or choose a household:</h1>
        <button className={`general-btn ${showCreate ? "household-inactive-btn": ""}`} onClick={() => setShowCreate(prev => (!prev))}>+ Create household</button>
    </section>
    {showCreate && <section>
        <form action={createHousehold}>
                <div className="input-group">
                    <label htmlFor="reg-name">Name</label>
                    <input id="reg-name" name="name" type="text" placeholder="Chaos family" required />
                </div>

                <button type="submit" className="general-btn">
                    Create
                </button>
            </form>
    </section>}
    <section className="household-cards">
        {householdList}
    </section>
</div>
    )
}