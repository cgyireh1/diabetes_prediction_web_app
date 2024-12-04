import { IoBarChartOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { SiEasyeda } from "react-icons/si";

export default function Services() {
    const servicesList = [
        { 
            icon: <IoBarChartOutline className="icon-about"/>, 
            title: "Accurate Predictions", 
            description: "Get precise diabetes risk assessments powered by machine learning models." 
        },
        {  
            icon: <SiEasyeda className="icon-about"/>,
            title: "Easy to Use", 
            description: "Input your data and receive a clear, actionable prediction instantly." 
        },
        { 
            icon: <CiLock  className="icon-about"/>, 
            title: "Secure Data", 
            description: "We prioritize your privacy with secure data handling practices." 
        },
     
    ];

    return (
        <section className="services" id="services">
            <h2>Why Choose Us?</h2>
            <div className="align">
                {servicesList.map(service => (
                    <article key={service.title} className="serv">
                        {service.icon}
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

