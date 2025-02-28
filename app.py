from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        print("Flask: No file part in request ❌")
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        print("Flask: No selected file ❌")
        return jsonify({"error": "No selected file"}), 400

    try:
        print(f"Flask: Received file {file.filename} ✅")  # 🔴 Verify this in Flask logs
        df = pd.read_csv(file)  

        labels = df.columns.tolist()
        values = df.iloc[0].tolist()

        chart_data = {
            "labels": labels,
            "datasets": [
                {
                    "label": "Data",
                    "data": values,
                    "borderColor": "rgba(75, 192, 192, 1)",
                    "backgroundColor": "rgba(75, 192, 192, 0.2)",
                    "borderWidth": 1
                }
            ]
        }

        print("Flask: File uploaded successfully ✅")
        return jsonify(chart_data)

    except Exception as e:
        print("Flask Error:", str(e))  
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
