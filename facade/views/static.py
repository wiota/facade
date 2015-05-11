import os
from flask import Blueprint, safe_join, send_file
from flask import current_app as app
from flask.ext.cors import cross_origin
from werkzeug.exceptions import NotFound

mod = Blueprint('static', __name__)

@mod.route('/<path:filename>')
@cross_origin()
def static(filename, subdomain="static"):
    hostname = app.config['HOST'].hostname
    static_folder = "templates/%s/static/" % (hostname)
    filename = safe_join(static_folder, filename)
    if not os.path.isabs(filename):
        filename = os.path.join(app.root_path, filename)
    if not os.path.isfile(filename):
        raise NotFound()
    return send_file(filename)
