import os
from portphilio import create_app
from landlord import Landlord
from flask import Flask

if __name__ == '__main__' :
    app = Flask(__name__)
    app.debug = os.environ.get('FLASK_DEBUG') == 'True'
    app.wsgi_app = Landlord(create_app)
    port = int(os.environ.get('PORT', 5000))
    app.run(host="0.0.0.0", port=port, use_debugger=True, use_reloader=True)
