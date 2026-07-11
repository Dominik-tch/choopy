import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { Trash2, Circle, CheckCircle2, Plus } from "lucide-react";
import { apiFetch, extractErrorMessage } from '../utils';
import "./ShoppingView.css";

function ShoppingItem({ item, onToggle, onDelete }) {
    return (
        <article className={`shopping-item ${item.done ? "done" : ""}`}>
            <button
                className="shopping-toggle-btn" 
                onClick={() => onToggle(item.id)}
                title={item.done ? "Mark as undone" : "Mark as done"}
            >
                {item.done ? (
                    <CheckCircle2 size={24} className="icon-done" />
                ) : (
                    <Circle size={24} className="icon-open" />
                )}
            </button>
            
            <p className="shopping-text">{item.content}</p>
            <div>
                <button
                    className="shopping-delete-btn" 
                    onClick={() => onDelete(item.id)}
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
    const [isLoading, setIsLoading] = useState(false);

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
        if (!newItemContent.trim()) return;

        setIsLoading(true);
        try {
            const response = await apiFetch('/api/shopping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ householdId, content: newItemContent.trim() })
            });

            if (response.ok) {
                setNewItemContent(""); 
                loadItems(); 
            } else {
                const backendError = await extractErrorMessage(response, "Failed to add item.");
                toast.error(backendError);
            }
        } catch (err) {
            toast.error("Network error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleToggleItem(id) {
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === id ? { ...item, done: !item.done } : item
            )
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
        <>
            <div className="shopping-view-container">
                <div className="shopping-header">
                    <h1 className="page-title">Shopping List</h1>
                </div>

                <form className="shopping-form" onSubmit={handleAddItem}>
                    <input 
                        type="text" 
                        className="shopping-input"
                        placeholder="Milk"
                        value={newItemContent}
                        onChange={(e) => setNewItemContent(e.target.value)}
                        autoFocus
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        className="shopping-add-btn"
                        disabled={!newItemContent.trim() || isLoading}
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
                            />
                        ))
                    ) : (
                        <p className="empty-state">Your shopping list is empty. Add something!</p>
                    )}
                </section>
            </div>
        </>
    );
}