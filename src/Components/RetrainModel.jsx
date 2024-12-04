import { useState } from "react";
import "./form.css";

export default function RetrainModel() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [retrainResults, setRetrainResults] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setErrorMessage("Please upload a dataset before retraining.");
      return;
    }

    setLoading(true);
    setStatusMessage("");
    setErrorMessage("");
    setRetrainResults(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://diabetes-prediction-web-app-l0ks.onrender.com/retrain-model", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setStatusMessage("Model retrained successfully!");
        setRetrainResults(result);
      } else {
        setErrorMessage("Failed to retrain the model. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while retraining the model.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="retrain-container">
      <div className="form-container">
        <h1>Retrain the Model</h1>
        <h2>Upload Data for Retraining</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="data-file">Upload Dataset:</label>
          <input
            type="file"
            id="data-file"
            name="data-file"
            accept=".csv"
            onChange={handleFileChange}
          />
          <button type="submit">Retrain Model</button>
        </form>

        {statusMessage && <div className="success-message">{statusMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {loading && (
          <div className="loading">
            Retraining model, please wait...
          </div>
        )}

        {retrainResults && (
          <div className="retrain-results">
            <h3>Retraining Results:</h3>
            <p><strong>Accuracy:</strong> {retrainResults.accuracy}</p>

            <h4>Classification Report:</h4>
            <div className="classification-report-wrapper" style={{ overflowX: "auto" }}>
              <pre className="classification-report">
                {retrainResults.classification_report}
              </pre>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
