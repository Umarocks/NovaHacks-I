# app/controllers/api_controller.py

from flask import Blueprint, request, jsonify
from app.services.langchain_service import handle_prompt_service

# Create a blueprint for API routes
api = Blueprint('api', __name__)

@api.route('/prompt', methods=['POST'])
def handle_prompt():
    try:
        # Get the prompt from the request body
        data = request.json
        prompt = data.get('prompt')

        # Use the service function to process the prompt
        response = handle_prompt_service(prompt)

        # Return the response as JSON
        return jsonify({"response": response}), 200
    except Exception as e:
        # Return an error response if something goes wrong
        return jsonify({"error": str(e)}), 500
    
@api.route('/territories', methods=['GET'])
def get_information_by_territory():
    try:
        # Get the territory from the query parameters
        territory = request.args.get('territories') # skip this one for now, just do all
        year = request.args.get('year')
        parameter = request.args.get('parameter')

        # Use the service function to get information by territory
        response = get_information_by_territory_service(territory, year, parameter)

        # Return the response as JSON
        return jsonify(response), 200
    except Exception as e:
        # Return an error response if something goes wrong
        return jsonify({"error": str(e)}), 500