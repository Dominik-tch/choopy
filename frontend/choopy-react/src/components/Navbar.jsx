import { User, House } from "lucide-react";
import "./Navbar.css";

export default function Navbar(props) {
    return (
        <nav className="navbar-container">
            <button
                className={"navbar-item" + (props.viewState === "house" ? " active" : "")}
                onClick={() => props.viewHandler("house")}
            >
                <House />
                <small>House</small>
            </button>
            
            <button 
                className={"navbar-item" + (props.viewState === "profile" ? " active" : "")}
                onClick={() => props.viewHandler("profile")}
            >
                <User />
                <small>Profile</small>
            </button>
        </nav>
    );
}