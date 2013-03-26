from flask import Blueprint, render_template, request

app = Blueprint('admin', __name__, url_prefix='/admin')

@app.route('/')
def hello():
    return "admin interface" 
