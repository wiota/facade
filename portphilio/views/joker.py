from flask import Blueprint, render_template
from bson import ObjectId

app = Blueprint('joker', __name__, url_prefix='/joker')

@app.route('/')
def hello():
    return render_template('index.html', name="Ryan")

@app.route('/joke/')
def joke():
    joke = db.joke.find_one()
    return render_template('joke.html', setup=joke['setup'], joke_id=joke['_id'])

@app.route('/punchline/<joke_id>')
def punchline(joke_id):
    joke = db.joke.find_one({'_id':ObjectId(joke_id)})
    return render_template('punch.html', punchline=joke['punchline'])
