import shlex
from flask import Flask, request, render_template, jsonify, send_file, send_from_directory, url_for, redirect
import subprocess
import os

app = Flask(__name__)

# Setting the base directory
base_dir = os.path.dirname(os.path.abspath(__file__))
SCRIPT_PATH = os.path.join(base_dir, 'story-book.gpt')

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/pages/<path:filename>')
def pages(filename):
    file_path = os.path.join('pages', filename)
    return send_file(file_path)

@app.route('/story')
def story():
    return render_template('story.html')

@app.route('/generate', methods=['POST'])
def generate_story():
    prompt = request.form['prompt']
    pages = request.form['pages']
    command_line = f"gptscript story-book.gpt --prompt "+prompt+" --pages "+pages
    
    try:
        subprocess.run(command_line, shell=True, check=True)  
       
        # Create a URL to the generated HTML file
        generated_url = url_for('story')

        return jsonify({'message': 'Story generated successfully.', 'url': generated_url})
    except subprocess.CalledProcessError as e:
        return jsonify({'error': 'Failed to generate story', 'details': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=False)
