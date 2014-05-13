from threading import Lock


class HostDispatcher(object):

    def __init__(self, create_app):
        """ Initialize the application dispatcher. """

        # The function to call when creating a new app
        self.create_app = create_app

        # Threading lock
        self.lock = Lock()

        # Instances of already created applications
        self.instances = {}

    def get_application(self, host):
        """ Return an initialized application for a given host. """

        # Extract the hostname from the port
        host = host.split(':')[0]

        with self.lock:
            # Get the correct app from the instances list
            app = self.instances.get(host)

            # If the app doesn't already exist, create it
            if app is None:
                app = self.create_app(host)

                # Add it to the instances list
                self.instances[host] = app
            return app

    def __call__(self, environ, start_response):
        app = self.get_application(environ['HTTP_HOST'])
        return app(environ, start_response)
