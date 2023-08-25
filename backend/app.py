from flask import Flask, request, jsonify, send_from_directory
from constants import PATHS
from init_llama import init_llm
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
api = Flask(__name__)
CORS(api)


UPLOAD_FOLDER = PATHS.documents
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'doc', 'docx', 'html', 'tif'])
api.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

is_initialized = False
query_engine = None
@api.route('/llm/start', methods=['POST'])
def start_llm_init():
    global is_initialized
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
    global query_engine
    data = request.get_json()
    query_text = data.get('query', '')
    response = query_engine.query(query_text)
    
    if query_text in str(response):
        response = str(response).replace(query_text, '')
    
    return jsonify({'response': str(response)})

@api.route('/llm/status', methods=['GET'])
def get_status():
    if is_initialized:
        return jsonify({'status': 'initialized'})

@api.route('/backend/documents', methods=['POST'])
def upload_file():
    if 'document' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['document']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(api.config['UPLOAD_FOLDER'], filename))
        return jsonify({'status': 'file uploaded successfully'})

    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == "__main__":
    api.run(port=5000, debug=True)