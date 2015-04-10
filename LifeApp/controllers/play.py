from flask import *

from ..models import *
from ..config import *
from helpers import *
from player import *
from tile import *
from board import *
import random

play = Blueprint('play', __name__, template_folder='templates')

@play.route('/play')
def play_route():

	message = ""
	players = []
	for i in range(0,4):
		player = AIPlayer(str(i))
		players.append(player)
	board = Board()
	end_of_game = 0

	while end_of_game != 4:
		for p in players:
			message = message + "\n"
			message = message + "starting " + p.name + "'s turn\n" 
			if p.done == False:
				cur_position = p.position
				roll = random.randint(1, 10)
				message = message + "player starting from position " + str(cur_position) + " and rolled " + str(roll) + "\n"

				while roll > 0:
					message = message + "space " + str(cur_position) + "\n"
					if cur_position == -1:
						college = random.randint(0,1)
						if college == 1:
							message = message + "player is going to college\n"
							cur_position = 0
						else: 
							message = message +  "player starting career\n"
							cur_position = 11
					elif cur_position == 10:
						message = message + "end of college fork\n"
						cur_position = 13
					elif cur_position == 36:
						family = random.randint(0,1)
						if family == 1:
							message = message +  "player takes family route\n"
							cur_position = 37
						else:
							message = message + "player doesn't take family route\n"
							cur_position = 46
					elif cur_position == 45:
						message = message +  "end of family fork\n"
						cur_position = 50
					elif cur_position == 73:
						risky = random.randint(0,1)
						if risky == 1:
							message = message + "player takes risky route\n"
							cur_position = 74
						else:
							message = message + "player takes safe route\n"
							cur_position = 78
					elif cur_position == 77:
						message = message + "end of risky fork\n"
						cur_position = 82
					elif cur_position == 89:
						message =  message + "player " + p.name + " has retired\n"
						p.done = True
						roll = 0
						end_of_game = end_of_game + 1
					else:
						cur_position = cur_position + 1

					roll = roll - 1

					if cur_position in board.paydays:
						# need to have salary
						p.bankroll = p.bankroll + 10000 
						message = message + "player " + p.name + " got paid and now has " + str(p.bankroll) + " dollars\n"

				p.position = cur_position
				message = message + "player ends turn on space " + str(p.position) + "\n"

			else:
				message = message + "player is already retired\n"


	return render_template('create_game.html',message=message)



