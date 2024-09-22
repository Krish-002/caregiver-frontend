from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from PIL import Image
import pytesseract
import requests
from io import BytesIO
import json
import re

app = Flask(__name__)

FILE_PATH = "/Users/maxencegilloteaux/ComputerScience/Personal/Hackathons/caregiver/src/Data/users.json"

@app.route('/update-users', methods=['POST'])
def update_users():
    try:
        # Get the JSON data from the request
        updated_data = request.json

        # Write the updated data to the users.json file
        with open(FILE_PATH, 'w') as json_file:
            json.dump(updated_data, json_file, indent=2)

        return jsonify({"message": "File updated successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Allow only specific origins
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

def extract_text(image):
    custom_config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(image, config=custom_config)
    return text

def parse_prescription_info(text):
    url = "https://proxy.tune.app/chat/completions"
    headers = {
        "Authorization": "sk-tune-d3InGaOtdKOkyTC3O7zIrlPURLoSGbVqWw5",
        "Content-Type": "application/json",
    }
    data = {
        "temperature": 1,
        "messages": [
            {
                "role": "user",
                "content": f"Given the following text: {text}, do not add any other commentary. Return the drug name, strength, instructions, and quantity in the JSON. Please separate the drug name and strength into distinct categories."
            }
        ],
        "model": "openai/gpt-4o",
        "max_tokens": 300
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        return {"error": "HTTP error occurred", "details": str(http_err)}
    except requests.exceptions.RequestException as req_err:
        return {"error": "Request error occurred", "details": str(req_err)}
    except Exception as e:
        return {"error": "An error occurred", "details": str(e)}

def extract_json_from_string(string):
    json_match = re.search(r'\{.*\}', string, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
        return json.loads(json_str)
    return None

def extract_warnings_from_openfda(openfda_data):
    if "results" in openfda_data and openfda_data["results"]:
        result = openfda_data["results"][0]
        warnings = result.get('warnings', None)
        warnings_and_precautions = result.get('warnings_and_precautions', None)

        if warnings:
            return warnings
        elif warnings_and_precautions:
            return warnings_and_precautions
        else:
            return "No warnings or warnings and precautions found."
    else:
        return "No FDA data found."

def call_openfda_api(drug_name):
    url = f"https://api.fda.gov/drug/label.json?search=warnings:{drug_name}&limit=1"
    try:
        response = requests.get(url)
        response.raise_for_status()
        openfda_data = response.json()
        return extract_warnings_from_openfda(openfda_data)
    except requests.exceptions.HTTPError as http_err:
        return {"error": "HTTP error occurred", "details": str(http_err)}
    except requests.exceptions.RequestException as req_err:
        return {"error": "Request error occurred", "details": str(req_err)}
    except Exception as e:
        return {"error": "An error occurred", "details": str(e)}

# New Functionality: Shorten Warnings with Tune AI
def shorten_warnings(warnings):
    url = "https://proxy.tune.app/chat/completions"
    headers = {
        "Authorization": "sk-tune-d3InGaOtdKOkyTC3O7zIrlPURLoSGbVqWw5",
        "Content-Type": "application/json",
    }
    data = {
        "temperature": 1,
        "messages": [
            {
                "role": "user",
                "content": f"{warnings} Take the above warnings and shorten to dangerous drug interactions, and patient advisory. two sentences max for an app."
            }
        ],
        "model": "openai/gpt-4o",
        "max_tokens": 100
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        return {"error": "HTTP error occurred", "details": str(http_err)}
    except requests.exceptions.RequestException as req_err:
        return {"error": "Request error occurred", "details": str(req_err)}
    except Exception as e:
        return {"error": "An error occurred", "details": str(e)}

# New Functionality: Generate Dosage Schedule with Tune AI
def generate_dosage_schedule(instructions, quantity):
    url = "https://proxy.tune.app/chat/completions"
    headers = {
        "Authorization": "sk-tune-d3InGaOtdKOkyTC3O7zIrlPURLoSGbVqWw5",
        "Content-Type": "application/json",
    }
    data = {
        "temperature": 1,
        "messages": [
            {
                "role": "user",
                "content": f"Given this instruction from a prescription, '{instructions}', and avoiding sleeping times from 10pm to 8am, list times in an JAVASCRIPT array of strings surounded by square brackets, seperated by commas, with datetime format when to take this medication. The quantity is {quantity}. When the quantity reaches zero, append another time, the day after. Return only the array of dates, with NO commentary. Do not code, do the calculations and return only the list of dates, with commas between the times. rounded to the nearest hour."
            }
        ],
        "model": "openai/gpt-4o",
        "max_tokens": 300
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        return {"error": "HTTP error occurred", "details": str(http_err)}
    except requests.exceptions.RequestException as req_err:
        return {"error": "Request error occurred", "details": str(req_err)}
    except Exception as e:
        return {"error": "An error occurred", "details": str(e)}

@app.route('/process-image', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000')
def process_image():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight success'}), 200

    image_url = request.data.decode('utf-8').strip()

    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

    response = requests.get(image_url)
    if response.status_code != 200:
        return jsonify({"error": "Failed to retrieve image from URL"}), 400

    image = Image.open(BytesIO(response.content))
    text = extract_text(image)

    custom_parsed_info = parse_prescription_info(text)
    if "error" in custom_parsed_info:
        return jsonify(custom_parsed_info), 500

    message_content = custom_parsed_info["choices"][0]["message"]["content"]
    parsed_data = extract_json_from_string(message_content)

    if not parsed_data or "drug_name" not in parsed_data:
        return jsonify({
            "error": "Drug name not found in prescription text",
            "custom_parsed_info": custom_parsed_info
        }), 400

    drug_name = parsed_data["drug_name"]
    openfda_warnings = call_openfda_api(drug_name)

    if isinstance(openfda_warnings, list) and openfda_warnings:
        warnings_text = " ".join(openfda_warnings)
        shortened_warnings_response = shorten_warnings(warnings_text)
        if "choices" in shortened_warnings_response and len(shortened_warnings_response["choices"]) > 0:
            parsed_data['shortened_warnings'] = shortened_warnings_response["choices"][0]["message"]["content"]
        else:
            parsed_data['shortened_warnings'] = "No shortened warnings available."
    else:
        parsed_data['shortened_warnings'] = "No warnings available to shorten."

    dosage_instructions = parsed_data.get('instructions', '')
    quantity = parsed_data.get('quantity', 0)
    dosage_schedule_response = generate_dosage_schedule(dosage_instructions, quantity)
    if "choices" in dosage_schedule_response and len(dosage_schedule_response["choices"]) > 0:
        parsed_data['dosage_schedule'] = dosage_schedule_response["choices"][0]["message"]["content"]
    else:
        parsed_data['dosage_schedule'] = "No dosage schedule available."

    output_data = {"cleaned_info": parsed_data}
    return jsonify(output_data)

@app.route('/')
def home():
    return "Welcome to the Flask Backend"

if __name__ == '__main__':
    app.run(debug=True)
