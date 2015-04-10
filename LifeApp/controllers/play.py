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

	players = []
	for i in range(0,4):
		player = AIPlayer(str(i))
		players.append(player)
	board = Board()
	end_of_game = 0

	while end_of_game != 4:
		for p in players:
			print ""
			print "starting " + p.name + "'s turn"
			if p.done == False:
				cur_position = p.position
				roll = random.randint(1, 10)
				print "player starting from position " + str(cur_position) + " and rolled " + str(roll)

				while roll > 0:
					print "space " + str(cur_position)
					if cur_position == -1:
						college = random.randint(0,1)
						if college == 1:
							print "player is going to college"
							cur_position = 0
						else: 
							print "player starting career"
							cur_position = 11
					elif cur_position == 10:
						print "end of college fork"
						cur_position = 13
					elif cur_position == 36:
						family = random.randint(0,1)
						if family == 1:
							print "player takes family route"
							cur_position = 37
						else:
							print "player doesn't take family route"
							cur_position = 46
					elif cur_position == 45:
						print "end of family fork"
						cur_position = 50
					elif cur_position == 73:
						risky = random.randint(0,1)
						if risky == 1:
							print "player takes risky route"
							cur_position = 74
						else:
							print "player takes safe route"
							cur_position = 78
					elif cur_position == 77:
						print "end of risky fork"
						cur_position = 82
					elif cur_position == 89:
						print "player " + p.name + " has retired"
						p.done = True
						roll = 0
						end_of_game = end_of_game + 1
					else:
						cur_position = cur_position + 1

					roll = roll - 1

					if cur_position in board.paydays:
						# need to have salary
						p.bankroll = p.bankroll + 10000 
						print "player " + p.name + " got paid and now has " + str(p.bankroll) + " dollars"

				p.position = cur_position
				print "player ends turn on space " + str(p.position)

			else:
				print "player is already retired"



