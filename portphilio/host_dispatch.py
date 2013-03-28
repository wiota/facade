from threading import Lock

class HostDispatcher(object):

    def __init__(self, create_app):
        self.create_app = create_app
        self.lock = Lock()
        self.instances = {}

    def get_application(self, host):
        host = host.split(':')[0]
        print "Host is: " + host
        with self.lock:
            app = self.instances.get(host)
            if app is None:
                app = self.create_app(host)
                self.instances[host] = app
            return app

    def __call__(self, environ, start_response):
        app = self.get_application(environ['HTTP_HOST'])
        return app(environ, start_response)
