import os
from flask import Flask, request, render_template
from pymongo import Connection
from urlparse import urlparse
from bson.objectid import ObjectId
from portphilio_lib.models import *
from flask.ext.mongoengine import MongoEngine

# Get the URL for the database from the environment
MONGO_URL = os.environ.get('MONGOHQ_URL')

if MONGO_URL:
    # Create a new DB connection
    connection = Connection(MONGO_URL)
    # Parse the DB name from the URL
    db_name = urlparse(MONGO_URL).path[1:]
    # Create a new DB
    db_pm = connection[db_name]
else:
    # The environmental variable is not set
    sys.exit("MongoDB URL not found, exiting")


def get_subset(config, subset_name):
    return Subset.objects.get(slug=subset_name, owner=config["OWNER"])


def create_app(host):

    # Create a starter app
    app = Flask(__name__)

    # MongoEngine configuration
    app.config["MONGODB_SETTINGS"] = {
        "DB": urlparse(MONGO_URL).path[1:],
        "host": MONGO_URL}

    # MongoEngine DB
    db = MongoEngine(app)

    try :
        # Check if the host is in our host list
        owner = Host.objects.get(hostname=host).owner
    except :
        # This host doesn't exist!
        # TODO: return an app that gives a better response
        return app

    # Turn on debugging if it's set
    app.debug = os.environ.get('FLASK_DEBUG') == 'True'
    # Tell jinja to trim blocks
    app.jinja_env.trim_blocks = True
    # Expose the function to the template
    app.jinja_env.globals.update(get_subset=get_subset)

    # Make it a full-fledged tenant app
    app.config['STATIC_FOLDER'] = 'static'
    app.config['COMMON_FOLDER'] = 'common'
    app.config['DIRECTORY_INDEX'] = 'index.html'
    app.config['HOST'] = host
    app.config['OWNER'] = owner

    from portphilio.views import frontend
    frontend.db = db
    frontend.config = app.config
    app.register_blueprint(frontend.mod)

    app.logger.debug("App created for %s" % (host))

    return app
