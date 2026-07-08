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
                        <Icon />
                        <small>{item.label}</small>
                    </button>
                );
            })}
        </nav>
    );
}