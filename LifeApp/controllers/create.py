from flask import *

from ..models import *
from ..config import *
from helpers import *

create = Blueprint('create', __name__, template_folder='templates')

@create.route('/create', methods=['GET', 'POST'])
def create_route():
	
	message = None

	if 'message' in request.args:
		message = request.args['message']

		create_game();
		message = 'Successfully created a new game!'

	return render_template('create_game.html', message=message)