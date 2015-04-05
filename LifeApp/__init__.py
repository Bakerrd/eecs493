import os
from flask import Flask
from config import *
import controllers

app = Flask(__name__, template_folder='templates')

app.register_blueprint(controllers.index)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE

from models import db
db.init_app(app)


# comment this out using a WSGI like gunicorn
# if you dont, gunicorn will ignore it anyway
# if __name__ == '__main__':
#     # listen on external IPs
#     app.run(host='0.0.0.0', port=3000, debug=True)
