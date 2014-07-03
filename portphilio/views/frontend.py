from flask import Blueprint, request, send_file, abort, render_template
from flask import current_app as app
from portphilio_lib.tools import get_work_from_slug, retrieve_image

mod = Blueprint('frontend', __name__)


def template_path(template_file):
    """ Create a path to a named template with the host name
    """
    return '/'.join([app.config['HOST'].template, template_file])


def static_index(path):
    """ Create a path to the index file in a static directory
    """
    return '/'.join([domain(path), app.config['DIRECTORY_INDEX']])


def domain(path):
    """ Put the static folder and domain into a path
    """
    return '/'.join([app.config['STATIC_FOLDER'],
                     app.config['HOST'].hostname, path])


@mod.route('/robots.txt')
def static_from_root():
    # TODO: Figure out what is going on here
    return send_file('/'.join([app.config['STATIC_FOLDER'], request.path[1:]]))


@mod.route('/')
def index():
    """ Render the index template
    """
    return render_template(template_path('index.html'))


@mod.route('/<path:path>')
def root(path):
    try:
        if path.startswith(app.config['COMMON_FOLDER']):
            # The path starts with /common, send from the static folder
            return send_file('/'.join([app.config['STATIC_FOLDER'], path]))
        elif '.' in path.split('/')[-1]:
            # The last path element has an *.something extension
            return send_file(domain(path))
        else:
            # The path is for a static directory we don't usually support
            return send_file(static_index(path))
    except IOError:
        abort(404)


@mod.route('/events/')
def events():
    return render_template(template_path('events.html'))


@mod.route('/work')
def work():
    return "Maybe list all works here?"


@mod.route('/work/<category>')
def work_category(category):
    return "List all works in category " + category


@mod.route('/work/<category>/<slug>')
def work_individual(category, slug):
    work, media = get_work_from_slug(app.config['HOST'].owner, slug)
    return render_template(
        template_path('work_individual.html'), work=work, media=media)


@mod.route('/image/<image_name>')
def image(image_name):
    return retrieve_image(image_name, app.config['HOST'].owner.username)

# TODO: REMOVE


@mod.route('/image_test/<filename>')
def test(filename):
    return """
        <img src="/image/""" + filename + """"/></br>
        <img src="/image/""" + filename + """?w=100&h=100"/></br>
        <img src="/image/""" + filename + """?w=100"/></br>
        <img src="/image/""" + filename + """?h=100"/></br>
    """
