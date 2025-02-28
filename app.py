import pandas as pd
from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "uploads"

if not os.path.exists(app.config["UPLOAD_FOLDER"]):
    os.makedirs(app.config["UPLOAD_FOLDER"])

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(filepath)

    try:
        df = pd.read_csv(filepath)

        if df.empty:
            return jsonify({"error": "CSV file is empty"}), 400

        # Ensure no NaN values (replace NaN with 0)
        df.fillna(0, inplace=True)

        # Convert all numeric columns
        for col in df.columns[1:]:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

        chart_data = {
            "labels": df.iloc[:, 0].astype(str).tolist(),  # Convert first column to labels
            "datasets": [
                {
                    "label": col,
                    "data": df[col].tolist(),  # Ensure numeric values
                    "borderColor": "rgba(75, 192, 192, 1)",
                    "backgroundColor": "rgba(75, 192, 192, 0.2)",
                    "borderWidth": 1
                }
                for col in df.columns[1:]
            ]
        }

        return jsonify(chart_data)

    except Exception as e:
        return jsonify({"error": f"Failed to process CSV: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
