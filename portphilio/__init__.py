from flask import Flask
from portphilio_lib import tools


def create_app(host):
    app = Flask(__name__)
    db = tools.initialize_db(app)

    # Get the owner of the hostname
    owner = tools.get_owner(host)

    if owner is None:
        # TODO: return an app that gives a better response
        return app

    # Tell jinja to trim blocks
    app.jinja_env.trim_blocks = True
    # Expose a function to the template
    app.jinja_env.globals.update(get_subset=tools.get_subset)

    # Make it a full-fledged tenant app
    app.config['STATIC_FOLDER'] = 'static'
    app.config['COMMON_FOLDER'] = 'common'
    app.config['DIRECTORY_INDEX'] = 'index.html'
    app.config['HOST'] = host
    app.config['OWNER'] = owner

    # Register the frontend blueprint
    from portphilio.views import frontend
    frontend.db = db
    frontend.config = app.config
    app.register_blueprint(frontend.mod)

    app.logger.debug("App created for %s" % (host))

    return app
