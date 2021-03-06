import os
from flask import Flask
from toolbox import tools, template_tools
from toolbox.emailer import FacadeExceptionEmail
from toolbox.template_filters import format_nl2br
from toolbox.models import Host
import traceback

def create_app(hostname):
    template_folder = "./templates/%s/layouts/" % (hostname)
    app = Flask(__name__, static_folder=None, template_folder=template_folder)

    app.debug = os.environ.get('FLASK_DEBUG', 'FALSE').upper() == 'TRUE'

    app.logger.debug("Attempting to create app for %s" % (hostname))

    db = tools.initialize_db(app)

    # This is required for subdomains to work
    app.config["SERVER_NAME"] = hostname

    # REMOVE THIS WHEN ACTUALLY MOVING TO DOCKERIZATION #
    if app.debug:
        app.config["SERVER_NAME"] += ":%s" % (os.environ.get('PORT'))
    #####################################################

    app.logger.debug("SERVER_NAME is: %s" % (app.config["SERVER_NAME"]))

    host = tools.get_host_by_hostname(hostname)

    # TODO: Remove this after deployment
    if not host: # For regular domains
        host = tools.get_host_by_hostname("www." + hostname)
    if not host: # For .lime.wiota.co domains
        host = tools.get_host_by_hostname(hostname.replace('www.', ''))

    app.config['HOST'] = host

    app.logger.debug("HOST is: %s" % (app.config["HOST"]))

    if not host:
        app.logger.debug("No host found for: %s" % (hostname))
        app.logger.debug([host.hostname for host in Host.objects()])
        # This host doesn't exist. Add a ping endpoint for monitoring.
        @app.route('/ping')
        def ping():
            return ''

        return app

    # Tell jinja to trim blocks
    app.jinja_env.trim_blocks = True

    # Jinja formatting functions
    app.jinja_env.filters["nl2br"] = format_nl2br

    # Expose a function to the template
    app.jinja_env.globals.update(get_body=template_tools.get_body)
    app.jinja_env.globals.update(get_category=template_tools.get_category)
    app.jinja_env.globals.update(get_category_by_id=template_tools.get_category_by_id)
    app.jinja_env.globals.update(get_page=template_tools.get_page)
    app.jinja_env.globals.update(get_happenings=template_tools.get_happenings)
    app.jinja_env.globals.update(get_tag=template_tools.get_tag)
    app.jinja_env.globals.update(get_vertex=template_tools.get_vertex)

    # Register the www blueprint
    from facade.views import www
    app.register_blueprint(www.mod, subdomain="www")

    # Register the static blueprint
    from facade.views import static
    app.register_blueprint(static.mod, subdomain="static")

    # Register the naked domain blueprint
    from facade.views import naked
    app.register_blueprint(naked.mod)

    # Set the error handler/mailer
    if not app.debug:
        @app.errorhandler(Exception)
        def catch_all(exception):
            tb = traceback.format_exc()
            FacadeExceptionEmail(exception, tb, host).send()

    app.logger.debug("App created for %s" % (host.hostname))

    return app
