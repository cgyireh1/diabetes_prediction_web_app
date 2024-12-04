import chart1 from "../assets/cmatrix.png";
import chart2 from "../assets/heatmap.png";
import chart3 from "../assets/histo_hlevel.png";

export default function Visualization(){
    return(
        <section id="visualizations">
        <div className="visualizations-header">
            <h2>Explore the Feature Insights</h2>
            <p>These visualizations highlight the key features and model performance.</p>
        </div>

        <div className="visualization-container">
           
            <div className="visualization">
                <img src={chart1} alt="Confusion Matrix" />
                <div className="description">Confusion Matrix: Model Performance</div>
            </div>

         
            <div className="visualization">
                <img src={chart2} alt="Correlation Heatmap" />
                <div className="description">Correlation Heatmap: Feature Relationships</div>
            </div>

          
            <div className="visualization">
                <img src={chart3} alt="HbA1c Level Distribution" />
                <div className="description">Distribution Of HbA1c Levels by diabetes</div>
            </div>
        </div>
    </section>
    )
}