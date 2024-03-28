from flask import Blueprint, render_template

pb_routes = Blueprint('routes', __name__)

@pb_routes.route('/')
def index():
    return render_template('index.html')