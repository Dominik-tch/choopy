import React, { useState, useEffect, useRef } from "react";
import toast from 'react-hot-toast';
import { Trash2, Circle, CheckCircle2, Plus, Check } from "lucide-react";
import { apiFetch, extractErrorMessage } from '../utils';
import "./ShoppingView.css";

function ShoppingItem({ item, onToggle, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(item.content);
    const pressTimer = useRef(null);

    // --- Long Press Logic ---
    const startPress = () => {
        pressTimer.current = setTimeout(() => {
            setIsEditing(true);
            // Optionales kurzes haptisches Feedback auf dem Smartphone
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        }, 400); // 600 Millisekunden gedrückt halten
    };

    const cancelPress = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
        }
    };

    // --- Update Logic ---
    const handleSave = () => {
        const trimmed = editContent.trim();
        if (trimmed && trimmed !== item.content) {
            onUpdate(item.id, trimmed);
        } else {
            setEditContent(item.content); // Bei leeren Eingaben zurücksetzen
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') {
            setEditContent(item.content);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <article className="shopping-item editing">
                <input
                    type="text"
                    className="shopping-edit-input"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <button className="shopping-save-btn" onClick={handleSave} title="Save">
                    <Check size={20} />
                </button>
            </article>
        );
    }

    return (
        <article 
            className={`shopping-item ${item.done ? "done" : ""}`}
            onTouchStart={startPress}
            onTouchEnd={cancelPress}
            onTouchMove={cancelPress}
            onMouseDown={startPress}
            onMouseUp={cancelPress}
            onMouseLeave={cancelPress}
            // Verhindert, dass auf dem Handy das Standard-Menü (Kopieren etc.) stört
            onContextMenu={(e) => e.preventDefault()} 
        >
            <button
                className="shopping-toggle-btn" 
                onClick={(e) => { e.stopPropagation(); onToggle(item.id); }}
                title={item.done ? "Mark as undone" : "Mark as done"}
            >
                {item.done ? (
                    <CheckCircle2 size={24} className="icon-done" />
                ) : (
                    <Circle size={24} className="icon-open" />
                )}
            </button>
            
            <div className="shopping-item-content">
                <p className="shopping-text disable-select">{item.content}</p>
            </div>

            <div className="shoopping-item-info">
                <button
                    className="shopping-delete-btn" 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    title="Delete item"
                >
                    <Trash2 size={20} />
                </button>
                <span className="shopping-meta">Added by {item.writerUsername}</span>
            </div>
        </article>
    );
}

export default function ShoppingView({ householdId }) {
    const [items, setItems] = useState([]);
    const [newItemContent, setNewItemContent] = useState("");

    const inputRef = useRef(null);

    async function loadItems() {
        try {
            const response = await apiFetch(`/api/shopping/household/${householdId}`, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                setItems(data);
            } else {
                const backendError = await extractErrorMessage(response, "Failed to load shopping list.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    useEffect(() => {
        if (householdId) {
            loadItems();
        }
    }, [householdId]);

    async function handleAddItem(e) {
        e.preventDefault();
        const contentToSave = newItemContent.trim();
        if (!contentToSave) return;

        setNewItemContent(""); 
        
        if (inputRef.current) {
            inputRef.current.focus();
        }
        try {
            const response = await apiFetch('/api/shopping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ householdId, content: contentToSave })
            });

            if (response.ok) {
                loadItems();
            } else {
                const backendError = await extractErrorMessage(response, "Failed to add item.");
                toast.error(backendError);
                setNewItemContent(contentToSave);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
            setNewItemContent(contentToSave);
        }
    }

    // --- NEUE FUNKTION: UPDATE ---
    async function handleUpdateItem(id, newContent) {
        try {
            // Optimistisches Update im Frontend
            setItems(prevItems => 
                prevItems.map(item => item.id === id ? { ...item, content: newContent } : item)
            );

            const response = await apiFetch(`/api/shopping/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ householdId, content: newContent })
            });

            if (!response.ok) {
                const backendError = await extractErrorMessage(response, "Failed to update item.");
                toast.error(backendError);
                loadItems(); // Bei Fehler zurücksetzen
            }
        } catch (err) {
            toast.error("Network error. Update failed.");
            loadItems(); // Bei Fehler zurücksetzen
        }
    }

    async function handleToggleItem(id) {
        setItems(prevItems => 
            prevItems.map(item => item.id === id ? { ...item, done: !item.done } : item)
        );

        try {
            const response = await apiFetch(`/api/shopping/${id}/toggle`, {
                method: 'PATCH'
            });

            if (!response.ok) {
                toast.error("Failed to update item.");
                loadItems();
            }
        } catch (err) {
            toast.error("Network error. Update failed.");
            loadItems();
        }
    }

    async function handleDeleteItem(id) {
        try {
            const response = await apiFetch(`/api/shopping/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setItems(prevItems => prevItems.filter(item => item.id !== id));
                toast.success("Item removed.");
            } else {
                const backendError = await extractErrorMessage(response, "Failed to delete item.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        }
    }

    return (
        <div className="shopping-view-container">
            <div className="shopping-header">
                <h1 className="page-title">Shopping List</h1>
            </div>

            <form className="shopping-form" onSubmit={handleAddItem}>
                <input
                    ref={inputRef}
                    type="text" 
                    className="shopping-input"
                    placeholder="Milk"
                    value={newItemContent}
                    onChange={(e) => setNewItemContent(e.target.value)}
                />
                <button 
                    type="submit" 
                    className="shopping-add-btn"
                    disabled={!newItemContent.trim()}
                    title="Add to list"
                >
                    <Plus size={24} />
                </button>
            </form>

            <section className="shopping-list">
                {items.length > 0 ? (
                    items.map(item => (
                        <ShoppingItem 
                            key={item.id} 
                            item={item} 
                            onToggle={handleToggleItem}
                            onDelete={handleDeleteItem}
                            onUpdate={handleUpdateItem}
                        />
                    ))
                ) : (
                    <p className="empty-state">Your shopping list is empty. Add something!</p>
                )}
            </section>
        </div>
    );
}