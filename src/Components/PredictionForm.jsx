import axios from "axios";
import { useState } from "react";
import "./form.css";

export default function DiabetesPredictionForm() {
    const [formData, setFormData] = useState({
        gender: "",
        age: "",
        hypertension: "",
        heart_disease: "",
        bmi: "",
        HbA1c_level: "",
        blood_glucose_level: "",
        smoking_history: "never",
    });

    const [predictionResult, setPredictionResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("FormData being sent:", formData);
        try {
            const response = await axios.post("/predict", formData);
            console.log("Response from server:", response.data);
            setPredictionResult(response.data.prediction);
        } catch (error) {
            console.error("Error during prediction:", error.response || error.message);
            setPredictionResult("An error occurred while predicting.");
        }
        setLoading(false);
    };    
    

    return (
        <>
            <div className="space-top"></div>
            <div className="form-container">
                <h1>Diabetes Prediction</h1>
                <h2>Check Your Risk</h2>
                <form id="predictForm" onSubmit={handleSubmit}>
                    <label htmlFor="gender">Gender:</label>
                    <input
                        type="text"
                        id="gender"
                        name="gender"
                        placeholder="Enter (e.g. Male or Female)"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="hypertension">Hypertension:</label>
                    <input
                        type="number"
                        id="hypertension"
                        name="hypertension"
                        placeholder="Enter 1 for Yes, 0 for No"
                        value={formData.hypertension}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="heart_disease">Heart Disease:</label>
                    <input
                        type="number"
                        id="heart_disease"
                        name="heart_disease"
                        placeholder="Enter 1 for Yes, 0 for No"
                        value={formData.heart_disease}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="bmi">BMI:</label>
                    <input
                        type="number"
                        id="bmi"
                        name="bmi"
                        placeholder="Enter BMI e.g. 25.3"
                        value={formData.bmi}
                        onChange={handleChange}
                        step="0.1"
                        required
                    />
                    <label htmlFor="HbA1c_level">HbA1c Level:</label>
                    <input
                        type="number"
                        id="HbA1c_level"
                        name="HbA1c_level"
                        placeholder="Enter HbA1c level e.g. 6.5"
                        value={formData.HbA1c_level}
                        onChange={handleChange}
                        step="0.1"
                        required
                    />
                    <label htmlFor="blood_glucose_level">Blood Glucose Level:</label>
                    <input
                        type="number"
                        id="blood_glucose_level"
                        name="blood_glucose_level"
                        placeholder="Enter blood glucose level e.g. 110"
                        value={formData.blood_glucose_level}
                        onChange={handleChange}
                        step="0.1"
                        required
                    />
                    <label htmlFor="smoking_history">Smoking History:</label>
                    <select
                        id="smoking_history"
                        name="smoking_history"
                        value={formData.smoking_history}
                        onChange={handleChange}
                        required
                    >
                        <option value="never">never (you never smoked)</option>
                        <option value="current">current (smoke currently)</option>
                        <option value="former">former (used to smoke)</option>
                        <option value="ever">ever (ever smoked)</option>
                        <option value="not current">not current (on a break)</option>
                    </select>
                    <input type="submit" value="Predict" />
                </form>
                {loading && <p>Loading...</p>}
                {predictionResult && <p className="result">{predictionResult}</p>}
                {/* <div className="results-container" id="resultsContainer">
                    <p id="predictionResult" className="result">
                        {predictionResult}
                    </p>
                </div> */}
            </div>
        </>
    );
}
