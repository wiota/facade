from flask import Blueprint, abort, Response
from flask import render_template
from flask import current_app as app
from toolbox.tools import get_work_from_slug, get_category_from_slug, get_category_from_slug, get_happening_from_slug, retrieve_image
from toolbox.models import Host, CustomPage, Vertex

mod = Blueprint('frontend', __name__)


@mod.route('/robots.txt')
def static_from_root():
    return Response("User-agent: *\rDisallow: ", mimetype="text")


@mod.route('/')
def index():
    return render_template('index.html')


@mod.route('/image/<image_name>')
def image(image_name):
    return retrieve_image(image_name, app.config['HOST'].owner.email_hash)


@mod.route('/work/<slug>')
def work_individual(slug):
    work, media = get_work_from_slug(app.config['HOST'].owner, slug)
    return render_template('work_individual.html', work=work, media=media)

@mod.route('/id/<id>')
def by_id(id):
    vertex = Vertex.objects.get(owner=app.config['HOST'].owner, id=id)
    if vertex._cls == 'Vertex.Work':
        return render_template('work_individual.html', work=vertex, media=vertex.succset)
    elif vertex._cls == 'Vertex.Category':
        return render_template('category_individual.html', category=vertex, media=vertex.succset)
    return abort(404)

@mod.route('/category/<slug>')
def category_individual(slug):
    category = get_category_from_slug(app.config['HOST'].owner, slug)
    return render_template('category_individual.html', slug=slug, category=category)

@mod.route('/happening/<slug>')
def happening_individual(slug):
    happening = get_happening_from_slug(app.config['HOST'].owner, slug)
    return render_template('happening_individual.html', slug=slug, happening=happening)

# TODO: Leave this in for posterity for now, but remove
@mod.route('/work/<categoryslug>/<slug>')
def work_individual_old(categoryslug, slug):
    category = get_category_from_slug(app.config['HOST'].owner, categoryslug)
    work, media = get_work_from_slug(app.config['HOST'].owner, slug)
    return render_template('work_individual.html', work=work, media=media, category=category)


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
        return render_template("%s.html" % (cp.slug), cp=cp)
    return abort(404)
