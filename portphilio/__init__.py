import os
from flask import Flask, request, render_template
from pymongo import Connection
from urlparse import urlparse
from bson.objectid import ObjectId

# Get the URL for the database from the environment
MONGO_URL = os.environ.get('MONGOHQ_URL')

if MONGO_URL:
    # Create a new DB connection
    connection = Connection(MONGO_URL)
    # Parse the DB name from the URL
    db_name = urlparse(MONGO_URL).path[1:]
    # Create a new DB
    db = connection[db_name]
else:
    # The environmental variable is not set
    sys.exit("MongoDB URL not found, exiting")

def check_host(host):
    """ Check if the requested hostname exists. """
    # TODO: move this into a DB wrapper class
    host_exists = db.host.find_one({'hostname':host}) is not None
    return host_exists

def get_workset(config, workset_name):
    """ Allow a template to query the DB for a workset"""
    return db.worksets.find_one({'host':config["HOST"], 'name':workset_name})

def create_app(host):

    # Create a starter app
    app = Flask(__name__)
    # Turn on debugging if it's set
    app.debug = os.environ.get('FLASK_DEBUG') == 'True'
    # Tell jinja to trim blocks
    app.jinja_env.trim_blocks = True
    # Expose the function to the template
    app.jinja_env.globals.update(get_workset=get_workset)

    # Check if the host is in our host list
    if check_host(host) :
        # Make it a full-fledged tenant app
        app.config['STATIC_FOLDER'] = 'static'
        app.config['COMMON_FOLDER'] = 'common'
        app.config['DIRECTORY_INDEX'] = 'index.html'
        app.config['HOST'] = host

        from portphilio.views import frontend
        from portphilio.views import api
        frontend.db = db
        frontend.config = app.config
        api.db = db
        api.config = app.config
        app.register_blueprint(frontend.mod)
        app.register_blueprint(api.mod)

        app.logger.debug("App created for %s" % (host))
    else :
        # This host doesn't exist!
        abort(404)

    return app
