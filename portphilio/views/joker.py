from flask import Blueprint, render_template
from bson import ObjectId

mod = Blueprint('joker', __name__, url_prefix='/joker')

@mod.route('/')
def hello():
    return render_template('index.html', name="Ryan")

@mod.route('/joke/')
def joke():
    joke = db.joke.find_one()
    return render_template('joke.html', setup=joke['setup'], joke_id=joke['_id'])

@mod.route('/punchline/<joke_id>')
def punchline(joke_id):
    joke = db.joke.find_one({'_id':ObjectId(joke_id)})
    return render_template('punch.html', punchline=joke['punchline'])
