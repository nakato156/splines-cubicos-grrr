from flask import Flask
from .routes import pb_routes, api_routes

def create_app():
    app = Flask(__name__)

    app.register_blueprint(pb_routes, url_prefix='/')
    app.register_blueprint(api_routes, url_prefix='/api')

    return app 