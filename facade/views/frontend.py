from flask import Blueprint, abort, Response
from flask import render_template
from flask import current_app as app
from flask import request
from toolbox.tools import get_body, get_work_from_slug, get_category_from_slug, get_happenings_apex, get_happening_from_slug, retrieve_image
from toolbox.models import *

mod = Blueprint('frontend', __name__)

def make_404(path):
    # app.logger.warning('404: URL was: %s', path)
    return abort(404)


@mod.route('/robots.txt')
def static_from_root():
    return Response("User-agent: *\rDisallow: ", mimetype="text")


@mod.route('/')
def index():
    body = get_body(app.config['HOST'])
    return render_template('index.html', body=body);


@mod.route('/image/<image_name>')
def image(image_name):
    return retrieve_image(image_name, app.config['HOST'].bucketname)


@mod.route('/work/<slug>')
def work_individual(slug):
    try:
        work, media = get_work_from_slug(app.config['HOST'], slug)
    except Vertex.DoesNotExist:
        return make_404(request.path)
    return render_template('work_individual.html', work=work, media=media)


@mod.route('/id/<id>')
def by_id(id):
    vertex = Vertex.by_id(id, host=app.config['HOST'])
    if vertex._cls == 'Vertex.Work':
        return render_template('work_individual.html', work=vertex, media=vertex.succset)
    elif vertex._cls == 'Vertex.Category':
        return render_template('category_individual.html', category=vertex, media=vertex.succset)
    return make_404(request.path)


@mod.route('/category/<slug>')
def category_individual(slug):
    try:
        category = get_category_from_slug(app.config['HOST'], slug)
    except Category.DoesNotExist:
        return make_404(request.path)

    if category.layout:
        return render_template('/layouts/'+category.layout+'/category_individual.html', slug=slug, category=category)
    else:
        return render_template('category_individual.html', slug=slug, category=category)


@mod.route('/happening/<slug>')
def happening_individual(slug):
    try:
        happening = get_happening_from_slug(app.config['HOST'], slug)
    except Happening.DoesNotExist:
        return make_404(request.path)

    return render_template('happening_individual.html', slug=slug, happening=happening)


# TODO: Leave this in for posterity for now, but remove
@mod.route('/work/<categoryslug>/<slug>')
def work_individual_old(categoryslug, slug):
    try:
        category = get_category_from_slug(app.config['HOST'], categoryslug)
    except Category.DoesNotExist:
        return make_404(request.path)

    try:
        work, media = get_work_from_slug(app.config['HOST'], slug)
    except Work.DoesNotExist:
        return make_404(request.path)

    return render_template('work_individual.html', work=work, media=media, category=category)


@mod.route('/<slug>/')
def custom_page(slug):
    cp = app.config['HOST'].custom_from_slug(slug)
    if cp is not None:
        return render_template("%s.html" % (cp.slug), cp=cp)
    return make_404(request.path)
