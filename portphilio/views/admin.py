from flask import Blueprint, render_template, request

mod = Blueprint('admin', __name__, url_prefix='/admin')

@mod.route('/')
def hello():
    return "admin interface"
