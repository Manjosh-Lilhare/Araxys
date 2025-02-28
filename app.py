import os
import pandas as pd
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

@app.route("/")
def home():
    return render_template("index.html")
@app.route("/upload", methods=["POST"])
def upload_file():
    print("Received request at /upload")  # Debugging

    if "file" not in request.files:
        print("Error: No file part in request")
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    chart_type = request.form.get("chartType", "line")

    if file.filename == "":
        print("Error: No selected file")
        return jsonify({"error": "No selected file"}), 400

    print(f"Received file: {file.filename}, Chart Type: {chart_type}")

    # Save and process file
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(filepath)
    
    df = pd.read_csv(filepath)
    chart_data = {
        "labels": df.iloc[:, 0].astype(str).tolist(),
        "datasets": [
            {
                "label": col,
                "data": df[col].tolist(),
                "borderColor": "rgba(75, 192, 192, 1)",
                "backgroundColor": "rgba(75, 192, 192, 0.2)",
                "borderWidth": 1
            }
            for col in df.columns[1:]
        ],
        "chartType": chart_type
    }
    
    return jsonify(chart_data)


if __name__ == "__main__":
    app.run(debug=True)
