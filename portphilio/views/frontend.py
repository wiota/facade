from flask import Blueprint, request, send_file, abort, send_from_directory
from flask import current_app as app
from flask import render_template
import os

mod = Blueprint('frontend', __name__)

# Create a path to a named template with the host name
def template_path(template_name) :
    return '/'.join([app.config['HOST'], template_name])

def static_index(path):
    return '/'.join([domain(path), app.config['DIRECTORY_INDEX']])

def domain(path):
    return '/'.join([app.config['STATIC_FOLDER'], app.config['HOST'], path])

@mod.route('/robots.txt')
def static_from_root():
    return send_file('/'.join([app.config['STATIC_FOLDER'], request.path[1:]]))

@mod.route('/')
def index():
    return render_template(template_path('index.html'))

@mod.route('/<path:path>')
def root(path):
    try :
        if path.startswith(app.config['COMMON_FOLDER']) :
            # The path starts with /common, send from the static folder
            return send_file('/'.join([app.config['STATIC_FOLDER'], path]))
        elif '.' in path.split('/')[-1] :
            # The last path element has an *.something extension
            return send_file(domain(path))
        else :
            # The path is for a static directory we don't usually support
            return send_file(static_index(path))
    except IOError:
        abort(404)

@mod.route('/events')
@mod.route('/events/')
def events() :
    return render_template(template_path('events.html'))

@mod.route('/work')
def work() :
    return "Maybe list all works here?"

@mod.route('/work/<category>')
def work_category(category) :
    return "List all works in category " + category

@mod.route('/work/<category>/<slug>')
def work_individual(category, slug) :
    work = db.work.find_one({'host':app.config['HOST'], 'slug':slug})
    if work is not None :
        work['media'] = deref_list('media', work['media'])
    return render_template(template_path('work_individual.html'), work=work)

def deref_list(collection, _list):
    return [dereference(collection, x) for x in _list]

def dereference(collection, _id):
    return db[collection].find_one({'_id': _id})
