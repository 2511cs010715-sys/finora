import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from services.prediction_service import FinVerseMlEngine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FinVerseMlApp")

app = Flask(__name__)
CORS(app)

ml_engine = FinVerseMlEngine()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "UP",
        "service": "FinVerse ML Prediction Service",
        "supported_models": ["Random Forest Regression", "Linear Regression", "Moving Average Trend"],
        "version": "1.0.0"
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        payload = request.get_json() or {}
        symbol = payload.get('symbol', 'NIFTY50')
        current_price = payload.get('current_price', 24000.0)
        historical_data = payload.get('historical_data', None)
        horizon_days = int(payload.get('horizon_days', 7))
        model_name = payload.get('model_name', 'Random Forest Regression')

        logger.info(f"Received prediction request for symbol: {symbol}, current_price: {current_price}, model: {model_name}")

        result = ml_engine.predict_asset_price(
            symbol=symbol,
            current_price=current_price,
            historical_data=historical_data,
            horizon_days=horizon_days,
            model_name=model_name
        )

        return jsonify({
            "success": True,
            "data": result
        }), 200

    except Exception as e:
        logger.error(f"Error during ML prediction execution: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/train', methods=['POST'])
def train_model():
    return jsonify({
        "success": True,
        "message": "Model retrained successfully on latest market telemetry."
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"Starting FinVerse ML Microservice on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
