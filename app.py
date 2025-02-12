from flask import Flask, jsonify
from flask_cors import CORS
from data_ingestion import get_air_quality_data

app = Flask(__name__)
CORS(app)  # Allow frontend requests

@app.route("/api/airquality")
def air_quality():
    data = get_air_quality_data()
    if data:
        return jsonify(data)
    return jsonify({"error": "Unable to fetch data"}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
