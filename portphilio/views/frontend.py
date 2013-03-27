from flask import Blueprint, render_template, request, send_file, abort
import os

mod = Blueprint('frontend', __name__)

@mod.route('/', defaults={'path': ''})
@mod.route('/<path:path>')
def hello(path):
    for p in [path, index(path), index(path + '/')] :
        try :
            return send_file(p)
        except IOError:
            pass
    abort(404)

def index(path):
    return 'static/localhost/' + path + 'index.html'
