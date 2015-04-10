from flask import *

from ..models import *
from ..config import *
from helpers import *

games = Blueprint('games', __name__, template_folder='templates')

@games.route('/games', methods=['GET', 'POST'])
def games_route():

	games = Game.query.all()


	return render_template('games.html', games=games)