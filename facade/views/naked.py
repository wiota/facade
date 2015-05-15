from flask import Blueprint, redirect, request
from urlparse import urlparse, urlunparse

mod = Blueprint('naked', __name__)

@mod.route('/', defaults={'path': ''})
@mod.route('/<path:path>')
def catch_all(path):
    url = list(urlparse(request.url))
    url[1] = ".".join(["www", url[1]])
    return redirect(urlunparse(url), code=301)
