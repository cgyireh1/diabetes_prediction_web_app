import { Link } from "react-router-dom";
import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa6";
export default function Footer(){
    return(
        <footer id="footer" className="footer-section">
        <div className="footer-branding">
            <h2>Diabetes Prediction</h2>
            <p>Your trusted tool for diabetes prediction.</p>
        </div>
        <div className="footer-navigation">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="" className="footer-link">Prediction</Link>
            <Link to="" className="footer-link"> Upload Data</Link>
            <Link to="/upload-data" className="footer-link">Retrain Model</Link>
        </div>
        
        <div className="footer-social-links">
            <Link to="#"  className="social-link">
                <FaLinkedin />
            </Link>
            <Link to="#" className="social-link">
                <FaInstagram />
            </Link>
            <Link to="#" className="social-link">
                <FaTwitter />
            </Link>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2024 Diab-Pred. All rights reserved.</p>
        </div>
    </footer>
    )
}