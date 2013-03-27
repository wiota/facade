from flask import Blueprint, render_template, request, send_file, abort
import os

mod = Blueprint('frontend', __name__)

@mod.route('/', defaults={'path': ''})
@mod.route('/<path:path>')
def hello(path):
    try :
        if path.startswith('static') :
            return send_file(path)
        elif '.' in path.split('/')[-1] :
            return send_file(domain(path))
        else :
            return send_file(index(path))
    except IOError:
        abort(404)

def index(path):
    if not path.endswith('/'):
        path += '/'
    return 'static/localhost/' + path + 'index.html'

def domain(path):
    return 'static/localhost/' + path
