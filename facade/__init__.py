import os
from flask import Flask
from toolbox import tools, template_tools


def create_app(hostname):
    static_folder = "./templates/%s/static/" % (hostname)
    app = Flask(__name__, static_url_path="/static", static_folder=static_folder)
    app.debug = os.environ.get('FLASK_DEBUG', False)
    db = tools.initialize_db(app)

    # Get the owner of the hostname
    host = tools.get_host_by_hostname(hostname)

    if host is None:
        # TODO: return an app that gives a better response
        return app

    # Tell jinja to trim blocks
    app.jinja_env.trim_blocks = True
    # Expose a function to the template
    app.jinja_env.globals.update(get_category=template_tools.get_category)
    app.jinja_env.globals.update(get_body=template_tools.get_body)
    app.jinja_env.globals.update(get_page=template_tools.get_page)
    app.jinja_env.globals.update(get_happenings=template_tools.get_happenings)
    app.jinja_env.globals.update(get_tag=template_tools.get_tag)

    # Make it a full-fledged tenant app
    app.config['COMMON_FOLDER'] = 'common'
    app.config['DIRECTORY_INDEX'] = 'index.html'
    app.config['HOST'] = host

    # Register the frontend blueprint
    from facade.views import frontend
    frontend.db = db
    frontend.config = app.config
    app.register_blueprint(frontend.mod)

    app.logger.debug("App created for %s" % (host))

    return app
