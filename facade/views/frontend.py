from flask import Blueprint, abort, Response
from flask import render_template
from flask import current_app as app
from flask import request
from toolbox.tools import get_body, get_vertex_from_slug, get_work_from_slug, get_category_from_slug, get_happenings_apex, get_happening_from_slug, retrieve_image
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
    return render_template('primary/index.html', body=body);


@mod.route('/image/<image_name>')
def image(image_name):
    return retrieve_image(image_name, app.config['HOST'].bucketname)


@mod.route('/id/<id>')
def by_id(id):
    try:
        vertex = Vertex.by_id(id, host=app.config['HOST'])
    except Vertex.DoesNotExist:
        return make_404(request.path)

    layout = (vertex.layout or "primary")
    vtype = (vertex.vertex_type or "vertex")
    return render_template(layout+'/'+vertex.vertex_type+'.html', vertex=vertex)


@mod.route('/id/<predecessor_slug>/<id>')
def by_predecessor_id(predecessor_slug, id):
    # should we validate the predecessor? NO
    try:
        vertex = Vertex.by_id(id, host=app.config['HOST'])
    except Vertex.DoesNotExist:
        return make_404(request.path)

    predecessor = get_vertex_from_slug(app.config['HOST'], predecessor_slug)

    layout = (vertex.layout or "primary")
    return render_template(layout+'/'+vertex.vertex_type+'.html', vertex=vertex, predecessor=predecessor)

@mod.route('/work/<slug>')
def work_individual(slug):
    try:
        vertex = get_vertex_from_slug(app.config['HOST'], slug)
    except Vertex.DoesNotExist:
        return abort(404)

    layout = (vertex.layout or "primary")

    # media parameter here should be removed - unnessecary
    return render_template(layout+'/work.html', slug=slug, work=vertex, media=vertex.succset)


@mod.route('/category/<slug>')
def category_individual(slug):
    try:
        vertex = get_vertex_from_slug(app.config['HOST'], slug)
    except Vertex.DoesNotExist:
        return make_404(request.path)

    layout = (vertex.layout or "primary")
    return render_template(layout+'/category.html', slug=slug, category=vertex)

'''
@mod.route('/<vertex_type>/<slug>')
def vertex_page(vertex_type, slug):
    vertex = get_vertex_from_slug(app.config['HOST'], slug)
    #
    # if not vertex or vertex.vertex_type != vertex_type
    #   return abort(404)
    #
    layout = (vertex.layout or "primary")
    return render_template(layout+'/'+vertex_type+'.html', vertex=vertex)
'''


@mod.route('/happening/<slug>')
def happening_individual(slug):
    try:
        vertex = get_vertex_from_slug(app.config['HOST'], slug)
    except Vertex.DoesNotExist:
        return make_404(request.path)

    layout = (vertex.layout or "primary")
    return render_template(layout+'/happening.html', slug=slug, happening=vertex)


# This is incredibly important. A suitable
# replacement is required before removal
@mod.route('/work/<categoryslug>/<slug>')
def work_individual_old(categoryslug, slug):
    try:
        vertex = get_vertex_from_slug(app.config['HOST'], slug)
    except Vertex.DoesNotExist:
        return make_404(request.path)

    try:
        predecessor = get_vertex_from_slug(app.config['HOST'], categoryslug)
    except Vertex.DoesNotExist:
        return make_404(request.path)

    layout = (vertex.layout or "primary")
    return render_template(layout+'/work.html', work=vertex, category=predecessor)

'''
@mod.route('/<vertex_type>/<predecessor>/<slug>')
def vertex_predecessor_page(vertex_type, predecessor, slug):
    predecessor = get_vertex_from_slug(app.config['HOST'], predecessor)
    vertex = get_vertex_from_slug(app.config['HOST'], slug)
    #
    # should we validate the predecessor? I don't want to,
    # but graph-path url will ensure it anyway.
    #
    # 404
    # if not vertex or predecessor or vertex.vertex_type != vertex_type
    #   return abort(404)
    #
    # layout fallback
    # layout = vertex.layout or 'default'
    #
    layout = (vertex.layout or "primary")
    return render_template(layout+'/'+vertex_type+'.html', vertex=vertex, predecessor=predecessor)

'''


@mod.route('/<slug>/')
def custom_page(slug):
    cp = app.config['HOST'].custom_from_slug(slug)
    if cp is not None:
        return render_template("primary/%s.html" % (cp.slug), cp=cp)
    return make_404(request.path)
