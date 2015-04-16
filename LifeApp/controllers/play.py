from flask import *

from ..models import *
from ..config import *
from helpers import *
from player import *
from static import *
from play_helper import *
import random
from json import dumps
from flask import Flask, jsonify

play = Blueprint('play', __name__, template_folder='templates')

@play.route('/play')
def play_route():
	careers = Careers.query.all()
	houses = Houses.query.all()
	tiles = Tiles.query.all()


	json_c_list = []
	for c in careers:
		career = {'career_id': c.career_id, 'title': c.title, 'salary': c.salary, 'img_path': c.img_path}
		json_c_list.append(career)
	career_list = json.dumps(json_c_list)

	json_h_list = []
	for h in houses:
		house = {'house_id': h.house_id, 'title': h.title, 'cost': h.cost, 'sell_price': h.sell_price}
		json_h_list.append(house)
	house_list = json.dumps(json_h_list)

	json_t_list = []
	for t in tiles:
		tile = {'tile_id': t.tile_id, 'title': t.title, 'value': t.value, 'x_val': t.x_val, 'y_val': t.y_val}
		json_t_list.append(tile)
	tile_list = json.dumps(json_t_list)


	return render_template('create_game.html', careers=json_c_list, houses=json_h_list, tiles=json_t_list)



