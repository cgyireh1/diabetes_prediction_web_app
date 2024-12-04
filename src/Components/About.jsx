import AI from "../assets/ai.png";
export default function About() {
    return (
        <section className="about-us" id="about">
            <h2>About Us</h2>
            <div className="about">
                <div className="about-img">
                    <img src={AI} alt="about-img" />
                </div>
                <div className="about-text">
                    <p>
                    Our mission is to bridge the gap between data-driven healthcare and everyday decision-making, offering an accessible, reliable, and easy-to-use tool for everyone. Whether you are managing existing health conditions or simply staying ahead, our solution is tailored to help you understand your risk factors and adopt preventive measures.<br /> We leverage cutting-edge machine learning algorithms to empower individuals in making informed health decisions.<br />
                    Join us in transforming health awareness with technology, innovation, and care at the forefront. <br /><span>Your journey to better health starts here!</span>
                    </p>
                </div>
            </div>
        </section>
    );
}

