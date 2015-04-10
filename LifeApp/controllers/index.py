from flask import *

from ..models import *
from ..config import *
from helpers import *

index = Blueprint('index', __name__, template_folder='templates')

@index.route('/')
def index_route():
    message = None

    if 'message' in request.args:
    	message = request.args['message']

   	

    if is_logged_in():
    	return render_template('user_index.html', message=message)
    else:
	    return render_template('public_index.html', message=message)