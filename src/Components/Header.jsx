import { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoCloudUploadOutline, IoHomeOutline } from "react-icons/io5";
import { FaDroplet, FaChartLine } from "react-icons/fa6";
import { IoMdSync } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaTimes } from "react-icons/fa";

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    
    const navLinks = [
        { to: "/", label: "Home", icon: <IoHomeOutline /> },
        { to: "/predict", label: "Prediction", icon: <FaChartLine /> },
        { to: "/upload-data", label: "Upload Data", icon: <IoCloudUploadOutline /> },
        { to: "/retrain", label: "Retrain Model", icon: <IoMdSync /> },
    ];

    return (
        <header>
            <nav className="navbar">
                <div className="logo">
                    <NavLink to="" className="navbar-brand"><FaDroplet /> Diab-Pred</NavLink>
                </div>
                <ul className="links">
                    {navLinks.map((link, index) => (
                        <li key={index}>
                            <NavLink className={({isActive}) =>{isActive ? "underline-link" : ""}}to={link.to}>{link.icon} {link.label}</NavLink>
                        </li>
                    ))}
                </ul>
                <div className="toggle_btn" onClick={toggleDropdown}>
                    {isOpen ? <FaTimes className="icon" /> : <RxHamburgerMenu className="icon" />}
                </div>
            </nav>

            {isOpen && (
                <nav className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
                    <ul>
                        {navLinks.map((link, index) => (
                            <li key={index}>
                                <NavLink to={link.to}>{link.icon} {link.label}</NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    );
}

export default Header;
