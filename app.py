import os, sys
from flask import Flask, render_template
from pymongo import Connection
from urlparse import urlparse
from bson.objectid import ObjectId

MONGO_URL = os.environ.get('MONGOHQ_URL')

if MONGO_URL:
    connection = Connection(MONGO_URL)
    db = connection[urlparse(MONGO_URL).path[1:]]
else:
    sys.exit("MongoDB URL not found, exiting")

app = Flask(__name__)
# Turn on debugging if it's set
app.debug = os.environ.get('FLASK_DEBUG') == 'True'
# Tell jinja to trim blocks
app.jinja_env.trim_blocks = True

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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
