from flask import *

from ..models import *
from ..config import *
from helpers import *

logout = Blueprint('logout', __name__, template_folder='templates')

@logout.route('/logout')
def logout_route():
    session.pop('username', None)
    return redirect(url_for('index.index_route'))