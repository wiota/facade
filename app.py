import os
from facade import create_app
from landlord import Landlord
from flask import Flask
import newrelic.agent

app = Flask(__name__)
app.debug = os.environ.get('DEVEL', 'FALSE').upper() == 'TRUE'
app.wsgi_app = Landlord(create_app, subdomains=['www', 'static'])
newrelic.agent.initialize('newrelic.ini')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host="0.0.0.0", port=port, use_reloader=True)
