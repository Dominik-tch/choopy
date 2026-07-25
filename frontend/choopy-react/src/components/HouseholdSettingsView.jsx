import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { ArrowLeft } from "lucide-react";
import { apiFetch } from '../utils';
import "./HouseholdSettingsView.css";

export default function HouseholdSettingsView({ householdId, onBack }) {
    const [color, setColor] = useState("#0cb954");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [prefResponse, detailsResponse] = await Promise.all([
                    apiFetch(`/api/households/${householdId}/preferences`),
                    apiFetch(`/api/households/details`)
                ]);

                if (prefResponse.ok) {
                    const prefData = await prefResponse.json();
                    if (prefData.color) setColor(prefData.color);
                }

                if (detailsResponse.ok) {
                    const detailsData = await detailsResponse.json();
                    const currentHousehold = detailsData.find(h => h.id === householdId);
                    if (currentHousehold) setName(currentHousehold.name);
                }
            } catch (err) {
                toast.error("Network error while loading settings.");
            } finally {
                setIsLoading(false);
            }
        }

        if (householdId) {
            loadData();
        }
    }, [householdId]);

    function handleColorChange(e) {
        const newColor = e.target.value;
        setColor(newColor);
        document.documentElement.style.setProperty('--theme-primary', newColor);
    }

    function handleHexInputChange(e) {
        let val = e.target.value;
        if (!val.startsWith('#') && val.length > 0) {
            val = '#' + val;
        }
        setColor(val);
        if (/^#[0-9A-F]{6}$/i.test(val) || /^#[0-9A-F]{3}$/i.test(val)) {
            document.documentElement.style.setProperty('--theme-primary', val);
        }
    }

    async function handleSave(e) {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Household name cannot be empty.");
            return;
        }
        try {
            const response = await apiFetch(`/api/households/${householdId}/preferences`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ color, householdName: name.trim() })
            });

            if (response.ok) {
                toast.success("Settings saved successfully!");
            } else {
                toast.error("Settings could not be saved.");
            }
        } catch (err) {
            toast.error("Network error. Please try again.");
        }
    }

    if (isLoading) {
        return <div className="settings-container"><p>Loading...</p></div>;
    }

    return (
        <div className="settings-container">
            {/* NEU: Header mit Back-Button */}
            <div className="settings-header-row">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="page-title" style={{ margin: 0 }}>Household Settings</h1>
            </div>

            <form className="settings-card" onSubmit={handleSave}>
                <div className="settings-group">
                    <label htmlFor="household-name">Household Name</label>
                    <input 
                        id="household-name"
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="settings-text-input"
                        placeholder="e.g. Chaos Family"
                    />
                </div>

                <hr className="settings-divider" />

                <div className="settings-group">
                    <label htmlFor="theme-color">Personal Theme Color</label>
                    <p className="settings-hint">
                        Choose an accent color for this household. This preference is only visible to you.
                    </p>
                    
                    <div className="color-picker-wrapper">
                        <input 
                            id="theme-color"
                            type="color" 
                            value={color.length === 7 ? color : "#0cb954"} 
                            onChange={handleColorChange}
                            className="color-picker"
                        />
                        <input 
                            type="text"
                            value={color}
                            onChange={handleHexInputChange}
                            className="color-hex-input"
                            maxLength={7}
                            placeholder="#HEX"
                        />
                    </div>
                </div>
                
                <button type="submit" className="general-btn save-btn">
                    Save Changes
                </button>
            </form>
        </div>
    );
}