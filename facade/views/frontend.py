from flask import Blueprint, request, send_file, abort, render_template, render_template_string, Response
from flask import current_app as app
from toolbox.tools import get_work_from_slug, get_category_from_slug, retrieve_image
from toolbox.models import Host, CustomPage

mod = Blueprint('frontend', __name__)


def template_path(template_file):
    """ Create a path to a named template with the host name
    """
    return '/'.join([app.config['HOST'].template, template_file])


@mod.route('/robots.txt')
def static_from_root():
    return Response("User-agent: *\rDisallow: ", mimetype="text")


@mod.route('/')
def index():
    """ Render the index template
    """
    return render_template(template_path('index.html'))


@mod.route('/image/<image_name>')
def image(image_name):
    return retrieve_image(image_name, app.config['HOST'].owner.username)


@mod.route('/work/<slug>')
def work_individual(slug):
    work, media = get_work_from_slug(app.config['HOST'].owner, slug)
    return render_template(
        template_path('work_individual.html'), work=work, media=media)


@mod.route('/category/<slug>')
def category_individual(slug):
    category = get_category_from_slug(app.config['HOST'].owner, slug)
    return render_template(
        template_path('category_individual.html'), slug=slug, category=category)


# TODO: Leave this in for posterity for now, but remove
@mod.route('/work/<category>/<slug>')
def work_individual_old(category, slug):
    work, media = get_work_from_slug(app.config['HOST'].owner, slug)
    return render_template(
        template_path('work_individual.html'), work=work, media=media)


# TODO: REMOVE
@mod.route('/image_test/<filename>')
def test(filename):
    return """
        <img src="/image/""" + filename + """"/></br>
        <img src="/image/""" + filename + """?w=100&h=100"/></br>
        <img src="/image/""" + filename + """?w=100"/></br>
        <img src="/image/""" + filename + """?h=100"/></br>
    """


@mod.route('/<slug>/')
def custom_page(slug):
    cp = app.config['HOST'].custom_from_slug(slug)
    if cp is not None:
        return render_template(template_path("%s.html" % (cp.slug)), cp=cp)
    return abort(404)
