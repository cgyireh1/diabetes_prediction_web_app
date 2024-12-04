import graph1 from "../assets/bmivsglucose-scatter.png";
import graph2 from "../assets/cmatrix.png";
import graph3 from "../assets/heatmap.png";
import graph4 from "../assets/histo_bmi.png";
import graph5 from "../assets/orderofimportance.png";
import graph6 from "../assets/ROC.png";

const menuItems = [
    { imgSrc: graph1, caption: "BMI vs Glucose" },
    { imgSrc: graph2, caption: "Confusion Matrix" },
    { imgSrc: graph3, caption: "Correlation Heatmap" },
    { imgSrc: graph4, caption: "BMI Distribution" },
    { imgSrc: graph5, caption: "Feature Importance" },
    { imgSrc: graph6, caption: "ROC Curve" }
];

export default function Graphs(){
    return (
        <section className="graphs-list" id="graphs-list">
            <h2>Preparing the Data Step by Preprocessing</h2>
            <div className="graph-img">
                {menuItems.map((item, index) => (
                    <figure key={index}>
                        <img src={item.imgSrc} alt={item.caption} />
                        <figcaption>{item.caption}</figcaption>
                    </figure>
                ))}
            </div>
        </section>
    );
};


