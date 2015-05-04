import os
from flask import Flask, safe_join, send_file
from werkzeug.exceptions import NotFound
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

    def static(filename):
        static_folder = "templates/%s/static/" % (hostname)
        filename = safe_join(static_folder, filename)
        if not os.path.isabs(filename):
            filename = os.path.join(app.root_path, filename)
        if not os.path.isfile(filename):
            raise NotFound()
        return send_file(filename)

    app.add_url_rule('/<path:filename>',
                     endpoint='static',
                     subdomain='static',
                     view_func=static)

    # Get the host of the hostname
    # We have a circular problem
    # Ideally, we want to set the template folder
    # with host.template. But that requires a DB
    # call which is initialized with the app as a
    # parameter. And the app needs the template
    # folder as a parameter to be created.
    host = tools.get_host_by_hostname(hostname)

    if host is None:

        if app.debug:

            @app.route('/info')
            def info():
                return "Hostname: %s" % hostname

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

    # Make it a full-fledged tenant app
    app.config['COMMON_FOLDER'] = 'common'
    app.config['DIRECTORY_INDEX'] = 'index.html'
    app.config['HOST'] = host

    # Register the frontend blueprint
    from facade.views import frontend
    frontend.db = db
    frontend.config = app.config
    app.register_blueprint(frontend.mod)

    # Set the error handler/mailer
    if not app.debug:
        @app.errorhandler(Exception)
        def catch_all(exception):
            tb = traceback.format_exc()
            FacadeExceptionEmail(exception, tb, host).send()

    app.logger.debug("App created for %s" % (host.hostname))

    return app
