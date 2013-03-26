from flask import Blueprint, render_template, request

app = Blueprint('frontend', __name__)

@app.route('/', defaults={'blah': ''})
@app.route('/<path:blah>')
def hello(blah):
    print "Path is: " + blah
    return app.send_static_file("index.html")
    #return "Frontend. host is: " + request.host + ", path is: " + blah 

@app.route('/favicon.ico/')
def favicon():
    return 'This page does not exist', 404
