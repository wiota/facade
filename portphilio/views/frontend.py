from flask import Blueprint, request, send_file, abort, send_from_directory
from flask import current_app as app
import os

mod = Blueprint('frontend', __name__)

def index(path):
    return '/'.join([domain(path), app.config['DIRECTORY_INDEX']])

def domain(path):
    return '/'.join([app.config['STATIC_FOLDER'], app.config['HOST'], path])

@mod.route('/robots.txt')
def static_from_root():
    return send_file('/'.join([app.config['STATIC_FOLDER'], request.path[1:]]))

@mod.route('/', defaults={'path': ''})
@mod.route('/<path:path>')
def root(path):
    try :
        if path.startswith(app.config['COMMON_FOLDER']) :
            return send_file('/'.join([app.config['STATIC_FOLDER'], path]))
        elif '.' in path.split('/')[-1] :
            return send_file(domain(path))
        else :
            return send_file(index(path))
    except IOError:
        abort(404)

@mod.route('/work')
def work() :
    return "Maybe list all works here?"

@mod.route('/work/<category>')
def work_category(category) :
    return "List all works in category " + category

@mod.route('/work/<category>/<_id>')
def work_individual(category, _id) :
    return "Show individual work (cat: " + category + ", _id: " + _id + ")"
