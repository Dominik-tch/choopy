import "./Navbar.css";

export default function Navbar({ items, viewState, viewHandler, setHouseholdState }) {
    return (
        <nav className="navbar-container">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <button
                        key={item.id}
                        className={
                            "navbar-item" +
                            (viewState === item.id ? " active" : "")
                        }
                        onClick={() => {
                            if (item.id === "home" && setHouseholdState) {
                                setHouseholdState(null);
                            } else {
                                viewHandler(item.id);
                            }}
                        }
                    >
                        <div className="icon-with-badge">
                            <Icon />
                            {item.badge && (
                                <span
                                    className={
                                        "badge " +
                                        (item.badge < 10
                                            ? "single-digit"
                                            : item.badge < 100
                                            ? "double-digit"
                                            : "max")
                                    }
                                >
                                    {item.badge > 99 ? "99+" : item.badge}
                                </span>
                            )}
                        </div>
                        <small>{item.label}</small>
                    </button>
                );
            })}
        </nav>
    );
}