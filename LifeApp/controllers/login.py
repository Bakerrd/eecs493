from flask import *

from ..models import *
from ..config import *
from helpers import *

login = Blueprint('login', __name__, template_folder='templates')

@login.route('/login', methods=['GET', 'POST'])
def login_route():
	message = None

	if request.method == 'GET':
		return render_template('login.html', message=message)

	if request.method == 'POST':
		username = request.form['username']
		if check_login(username, request.form['password']):
			session['username'] = username
			return redirect(url_for('index.index_route'))
		else:
			error = 'Incorrect username or password'

		return render_template('login.html', message=error)