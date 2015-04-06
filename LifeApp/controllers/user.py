from flask import *

from ..models import *
from ..config import *
from helpers import *

user = Blueprint('user', __name__, template_folder='templates')

@user.route('/user', methods=['GET', 'POST'])
def user_route():
	
	message = None

	if 'message' in request.args:
		message = request.args['message']

	if request.method == 'POST':
		if check_unique_username(request.form['username']):
			if check_password(request.form['password1'], request.form['password2']):
				create_user(request.form['username'], request.form['password1'])
				message = 'Successfully created new account!'
				return redirect(url_for('index.index_route', message=message))
			else:
				message = 'Passwords don\'t match. Please try again.'
				return redirect(url_for('user.user_route', message=message))
		else:
			message = 'That username has already been taken. Please try again.'
			return redirect(url_for('user.user_route', message=message))

	return render_template('new_user.html', message=message)