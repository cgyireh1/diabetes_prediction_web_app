import {motion } from "framer-motion";
import FadeRight from "../utils/Animation";
import { NavLink } from "react-router-dom";
import model from "../assets/retrain.png";
import Graphs from "./Graphs";
import RetrainModel from "./RetrainModel";


export default function Retrain(){
    return(
        <>
            <section className="home" id="home">
                    <motion.div
                        variants={FadeRight(1.5)}
                        initial="hidden"
                        animate="visible"
                        className="text"
                    >
                        <h1>Retrain Diabetes<br/><span> Model</span></h1>
                        <p>Here, you prepare, process and upload data to retrain <br />the machine learning model, ensuring it stays up-to-date <br />and continues to deliver reliable predictions.<br /> Together, let’s keep the system robust and effective for everyone!</p>
                        <button className="btn"><NavLink to="/retrain">Ready-Retrain</NavLink></button>
                    </motion.div>
                    <div className="home-img">
                        <motion.img
                            initial={{opacity: 0, x:200}}
                            animate={{opacity:1, x:0, rotate:0}}
                            transition={{duration: 1, delay:0.2}}
                            src={model} alt="tech" className="retrain-img"
                        />
                    </div>
            </section>
            <Graphs />
            {/* <Link to="/retrain/model"><button >PreProcess Data</button></Link> */}
            <RetrainModel />
        </>
    )
}