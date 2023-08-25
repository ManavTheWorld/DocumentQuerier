from flask import Flask, request, jsonify
from backend.init_llama import init_llm
from flask_cors import CORS
api = Flask(__name__)
CORS(api)

# Move the initialization of your conversational AI to the global scope (outside the route function)
# All your initialization code (from the initial code you provided) goes here

is_initialized = False

@api.route('/llm/start', methods=['POST'])
def start_llm_init():
    if not is_initialized:
        global query_engine
        query_engine = init_llm()
        is_initialized = True
        print('Initializing LLM...\n')
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'already initialized'})

@api.route('/llm/query', methods=['POST'])
def post_query():
    data = request.get_json()
    query_text = data.get('query', '')
    response = query_engine.query(query_text)
    return jsonify({'response': response})

@api.route('/llm/status', methods=['GET'])
def get_status():
    if is_initialized:
        return jsonify({'status': 'initialized'})

if __name__ == "__main__":
    api.run(port=5000, debug=True)