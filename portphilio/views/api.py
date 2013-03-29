from flask import Blueprint, request, send_file, abort, send_from_directory, Response
from flask import current_app as app
from bson.json_util import dumps
import os

mod = Blueprint('api', __name__, url_prefix='/api/v1')

@mod.route('/work')
def work() :
    return "Maybe list all works here?"

@mod.route('/work/<name>')
def work_name(name) :
    ret = db.category.find_one({'host':app.config['HOST'], 'name':name})
    if ret is not None :
        ret['works'] = deref_list('work', ret['works'])
    resp = Response(response=dumps(ret), status=200, mimetype="application/json")
    return resp

@mod.route('/work/<name>/<_id>')
def work_individual(name, _id) :
    return "Show individual work (name: " + name + ", _id: " + _id + ")"

def deref_list(collection, _list):
    return [dereference(collection, x) for x in _list]

def dereference(collection, _id):
    return db[collection].find_one({'_id': _id})
