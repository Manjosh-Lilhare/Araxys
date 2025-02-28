import os
import pandas as pd
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# Home Route
@app.route("/")
def home():
    return render_template("index.html")

# File Upload Route
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file:
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(filepath)

        # Process CSV
        df = pd.read_csv(filepath)
        chart_data = {
            "labels": df.iloc[:, 0].astype(str).tolist(),  # First column as labels
            "datasets": [
                {
                    "label": col,
                    "data": df[col].tolist(),
                    "borderColor": "rgba(75, 192, 192, 1)",
                    "backgroundColor": "rgba(75, 192, 192, 0.2)",
                    "borderWidth": 1
                }
                for col in df.columns[1:]  # Other columns as datasets
            ]
        }
        return jsonify(chart_data)

if __name__ == "__main__":
    app.run(debug=True)
