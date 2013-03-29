from flask import Blueprint, request, send_file, abort, send_from_directory
from flask import current_app as app
from flask import render_template
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

@mod.route('/events')
@mod.route('/events/')
def events() :
    template = '/'.join([app.config['HOST'], 'events.html'])
    return render_template(template)

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
    template = '/'.join([app.config['HOST'], 'work_individual.html'])
    return render_template(template, work=work)

def deref_list(collection, _list):
    return [dereference(collection, x) for x in _list]

def dereference(collection, _id):
    return db[collection].find_one({'_id': _id})
