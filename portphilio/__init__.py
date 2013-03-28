import os
from flask import Flask, request, render_template
from pymongo import Connection
from urlparse import urlparse
from bson.objectid import ObjectId

MONGO_URL = os.environ.get('MONGOHQ_URL')

if MONGO_URL:
    connection = Connection(MONGO_URL)
    db = connection[urlparse(MONGO_URL).path[1:]]
else:
    sys.exit("MongoDB URL not found, exiting")

def create_app(host):
    app = Flask(__name__)
    # Turn on debugging if it's set
    app.debug = os.environ.get('FLASK_DEBUG') == 'True'
    # Tell jinja to trim blocks
    app.jinja_env.trim_blocks = True

    app.config['STATIC_FOLDER'] = 'static'
    app.config['COMMON_FOLDER'] = 'common'
    app.config['DIRECTORY_INDEX'] = 'index.html'
    app.config['HOST'] = host

    from portphilio.views import frontend
    from portphilio.views import admin
    from portphilio.views import joker
    joker.db = db
    frontend.config = app.config
    app.register_blueprint(admin.mod)
    app.register_blueprint(joker.mod)
    app.register_blueprint(frontend.mod)

    return app
