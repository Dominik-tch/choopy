import logo from "../assets/Choopy_Logo.png";
import './Header.css';

export default function Header() {
    return (
        <header className="header-container">
            <img src={logo} className="header-logo" alt="Choopy Logo" />
            <h1 className="header-title">Choopy</h1>
        </header>
    )
}