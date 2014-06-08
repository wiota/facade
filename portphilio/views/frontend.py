from flask import Blueprint, request, send_file, abort, render_template, redirect
from flask import current_app as app
from portphilio_lib.tools import get_work_from_slug
import requests
import boto
import os

mod = Blueprint('frontend', __name__)

# Create a path to a named template with the host name


def template_path(template_name):
    return '/'.join([app.config['HOST'], template_name])

# Create a path to the index file in a static directory


def static_index(path):
    return '/'.join([domain(path), app.config['DIRECTORY_INDEX']])

# Put the static folder and domain into a path


def domain(path):
    return '/'.join([app.config['STATIC_FOLDER'], app.config['HOST'], path])

# TODO: Figure out what is going on here


@mod.route('/robots.txt')
def static_from_root():
    return send_file('/'.join([app.config['STATIC_FOLDER'], request.path[1:]]))

# Render the index template


@mod.route('/')
def index():
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
    work, media = get_work_from_slug(app.config['OWNER'], slug)
    return render_template(
        template_path('work_individual.html'), work=work, media=media)


@mod.route('/image/<image_name>')
def image(image_name):
    size = request.args.to_dict()
    w = size.get('w', None)
    h = size.get('h', None)
    split = image_name.split(".")
    fn = "".join(split[0:-1])
    ext = split[-1]
    params = {}
    bucket_name = "%s_%s" % (
        os.environ['S3_BUCKET'], app.config['OWNER'].username)
    url = "https://%s.s3.amazonaws.com/" % (bucket_name)

    if w is not None or h is not None:  # Some size is given
        fn += "-"  # Separator for size
        if w is not None:
            params["width"] = int(w)
            fn += "%sw" % (w)
        if h is not None:
            params["height"] = int(h)
            fn += "%sh" % (h)

        conn = boto.connect_s3()
        bucket = conn.get_bucket('portphilio_maggiecasey')
        key = bucket.get_key("%s.%s" % (fn, ext))

        if key is None:
            blit_job = {
                "application_id": os.environ['BLITLINE_APPLICATION_ID'],
                "src": {
                    "name": "s3",
                    "bucket": bucket_name,
                    "key": image_name
                },
                "functions": [
                    {
                        "name": "resize_to_fit",
                        "params": params,
                        "save": {
                            "image_identifier": image_name,
                            "s3_destination": {
                                "bucket": bucket_name,
                                "key": "%s.%s" % (fn, ext)
                            },
                        }
                    }
                ]
            }
            r = requests.post(
                "http://api.blitline.com/job",
                data={
                    'json': json.dumps(blit_job)})
            app.logger.debug(r.text)
        return redirect("%s%s.%s" % (url, fn, ext))
    else:
        return redirect("%s%s" % (url, image_name))
