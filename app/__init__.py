# app/__init__.py

from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  

   
    from app.controllers.api_controller import api
    app.register_blueprint(api, url_prefix='/api')

    return app

