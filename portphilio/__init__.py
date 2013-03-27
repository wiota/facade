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

def create_app(config_filename):
    app = Flask(__name__)
    #app.config.from_pyfile(config_filename)
    # Turn on debugging if it's set
    app.debug = os.environ.get('FLASK_DEBUG') == 'True'
    # Tell jinja to trim blocks
    app.jinja_env.trim_blocks = True

    from portphilio.views import frontend
    from portphilio.views import admin
    from portphilio.views import joker
    joker.db = db
    app.register_blueprint(admin.mod)
    app.register_blueprint(joker.mod)
    app.register_blueprint(frontend.mod)

    return app

app = create_app("put the config filename here")
