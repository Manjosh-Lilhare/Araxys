import os
import pandas as pd
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    try:
        df = pd.read_csv(file_path)
        df.fillna(0, inplace=True)  # Preprocessing: Fill missing values
        
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        categorical_cols = df.select_dtypes(exclude=['number']).columns.tolist()
        
        return jsonify({
            'message': 'File uploaded and processed',
            'columns': df.columns.tolist(),
            'numeric_columns': numeric_cols,
            'categorical_columns': categorical_cols
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/add_chart', methods=['POST'])
def add_chart():
    try:
        data = request.json
        chart_type = data.get("chartType")
        selected_columns = data.get("columns")
        
        if not chart_type or not selected_columns:
            return jsonify({'error': 'Missing chart type or columns'}), 400
        
        return jsonify({'message': 'Chart added successfully', 'chartType': chart_type, 'columns': selected_columns, 'chartWidth': 250, 'chartHeight': 8250})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
