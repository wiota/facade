import os
from flask import Flask
from toolbox import tools, template_tools
from toolbox.emailer import FacadeExceptionEmail
from toolbox.template_filters import format_nl2br
import traceback

def create_app(hostname):
    template_folder = "./templates/%s/layouts/" % (hostname)
    app = Flask(__name__, static_folder=None, template_folder=template_folder)
    db = tools.initialize_db(app)

    dev = os.environ.get('DEVEL', 'FALSE').upper() == 'TRUE'
    app.debug = dev

    # This is required for subdomains to work
    app.config["SERVER_NAME"] = hostname
    if dev:
        app.config["SERVER_NAME"] += ":%s" % (os.environ.get('PORT'))

    host = tools.get_host_by_hostname(hostname)

    # TODO: Remove this after deployment
    if not host: # For regular domains
        host = tools.get_host_by_hostname("www." + hostname)
    if not host: # For .lime.wiota.co domains
        host = tools.get_host_by_hostname(hostname.replace('www.', ''))

    app.config['HOST'] = host

    if not host:

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

    # Register the frontend blueprint
    from facade.views import frontend
    app.register_blueprint(frontend.mod, subdomain="www")

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
