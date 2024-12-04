import homeImg from "../assets/home.png";
import { NavLink } from "react-router-dom";
import FadeRight from "../utils/Animation";
import { motion } from "framer-motion";
import About from "./About";
import Services from "../Services";
import Visualization from "./Visualization";


export default function HomePage() {
    return (
        <div>
            <section className="home" id="home">
                <motion.div
                    variants={FadeRight(1.5)}
                    initial="hidden"
                    animate="visible"
                    className="text"
                >
                    <h1>Diabetes Prediction <br />Application<span> Machine Learning</span></h1>
                    <p>Our platform is designed to assess your risk of diabetes by analyzing <br />key health indicators, providing you with personalized insights<br /> to take proactive steps toward a healthier lifestyle...</p>
                    <button className="btn"><NavLink to="/retrain">Get Started</NavLink></button>
                </motion.div>
                <div className="home-img">
                    <motion.img
                        initial={{opacity: 0, x:200}}
                        animate={{opacity:1, x:0, rotate:0}}
                        transition={{duration: 1, delay:0.2}}
                        src={homeImg} alt="tech"
                    />
                </div>
            </section>
            <About />
            <Services />
            <Visualization />
        </div>
    );
}

