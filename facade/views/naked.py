from flask import Blueprint, redirect, url_for

mod = Blueprint('naked', __name__)

@mod.route('/')
def root():
    return redirect(url_for("www.index"))
