from flask import Blueprint, request, send_file, abort, send_from_directory
from flask import current_app as app
import os

mod = Blueprint('frontend', __name__)

@mod.route('/', defaults={'path': ''})
@mod.route('/<path:path>')
def root(path):
    try :
        if path.startswith(app.config['COMMON_FOLDER']) :
            return send_file('/'.join([app.config['STATIC_FOLDER'], path]))
        elif '.' in path.split('/')[-1] :
            print domain(path)
            return send_file(domain(path))
        else :
            return send_file(index(path))
    except IOError:
        abort(404)

@mod.route('/robots.txt')
def static_from_root():
    return send_file('/'.join([app.config['STATIC_FOLDER'], request.path[1:]]))

def index(path):
    return '/'.join([domain(path), app.config['DIRECTORY_INDEX']])

def domain(path):
    return '/'.join([app.config['STATIC_FOLDER'], app.config['HOST'], path])
