from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from src.prediction import DataPrediction

app = Flask(__name__)

# Load the model, scaler, and encoder (update with actual paths)
model_path = "models/retrained_model_7.pkl"
scaler_path = "models/scaler.pkl"
encoder_path = "models/encoder.pkl"

# Initialize the Prediction class
prediction = PredictionData(model_path=model_path, scaler_path=scaler_path, encoder_path=encoder_path)

@app.route('/')
def index():
    # Render homepage with visualizations
    return render_template('index.html')

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        # Assuming the user inputs data via a form on the page
        age = float(request.form['age'])
        gender = request.form['gender']
        hypertension = int(request.form['hypertension'])
        heart_disease = int(request.form['heart_disease'])
        smoking_history = request.form['smoking_history']
        bmi = float(request.form['bmi'])
        HbA1c_level = float(request.form['HbA1c_level'])
        blood_glucose_level = int(request.form['blood_glucose_level'])

        # Create a DataFrame for the input
        input_data = pd.DataFrame([{
            'age': age,
            'gender': gender,
            'hypertension': hypertension,
            'heart_disease': heart_disease,
            'smoking_history': smoking_history,
            'bmi': bmi,
            'HbA1c_level': HbA1c_level,
            'blood_glucose_level': blood_glucose_level
        }])

        # Get the prediction
        result = prediction.predict_single(input_data)

        return render_template('predict.html', prediction=result)
    
    return render_template('predict.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Handle file upload and retraining process here
        file = request.files['data_file']
        if file:
            # Process the file, retrain the model and save it
            # file.save(os.path.join("uploads", file.filename))  # Save the uploaded file
            return jsonify({"message": "Data uploaded successfully, retraining started!"})

    return render_template('upload.html')

@app.route('/retrain', methods=['GET', 'POST'])
def retrain():
    if request.method == 'POST':
        # Trigger model retraining here based on new data
        prediction.retrain_model()  # Assuming this method will handle retraining
        return jsonify({"message": "Model retraining triggered successfully!"})

    return render_template('retrain.html')

if __name__ == '__main__':
    app.run(debug=True)