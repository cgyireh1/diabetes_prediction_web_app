import { useState } from "react";

export default function UploadData() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to upload file: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading.");
    }
  };

  return (
    <div className="container">
      <div className="content-container">
        <h1>Upload Data for Retraining</h1>
        <p>
          Upload a dataset in CSV format. The uploaded data will be used for retraining the diabetes prediction model.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="file">Choose a CSV file:</label>
          <input
            type="file"
            id="file"
            accept=".csv"
            required
            onChange={handleFileChange}
          />
          <br />
          <br />
          <button className="btn-submit" type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
}
