from flask import *
from werkzeug import secure_filename

import os

from ..config import *
from ..models import *

#login stuff

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if is_logged_in():
            return f(*args, **kwargs)
        else:
            error = "You must be logged in to view this page"
            next_url = request.path + '?' + request.query_string
            print next_url
            return redirect(url_for('login.login_route', message=error, color='red', next_url=next_url))
    return decorated

def create_user(username, password):
	new_user = User(username, password)
	db.session.add(new_user)
	db.session.commit()

def check_login(username, password):
	user = User.query.get(username)
	if user == None:
		return False
	if password == user.password:
		return True
	else: 
		return False

def check_unique_username(username):
	user = User.query.get(username)
	if user == None:
		return True
	else:
		return False

def check_password(password1, password2):
	if password1==password2 and password1!="" and password2!="":
		return True
	else:
		return False

def is_logged_in():
	if "username" in session:
		return True
	else:
		return False

def get_current_user():
    if is_logged_in():
        return User.query.get(session['username'])
    else:
        return None				


# game stuff

def create_game():
	return True
