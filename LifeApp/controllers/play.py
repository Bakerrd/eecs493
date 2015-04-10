from flask import *

from ..models import *
from ..config import *
from helpers import *
from player import *
from static import *
import random

play = Blueprint('play', __name__, template_folder='templates')

@play.route('/play')
def play_route():

	message = []
	players = []
	for i in range(0,4):
		player = AIPlayer(str(i))
		players.append(player)
	board = Board()
	end_of_game = 0
	taken_career = []
	taken_ccareer = []

	careers = Careers.query.all()

	while end_of_game != 4:
		for p in players:
			temp = "\n\n"
			message.append(temp)
			temp = "starting " + p.name + "'s turn\n" 
			message.append(temp)
			if p.done == False:
				cur_position = p.position
				roll = random.randint(1, 10)
				temp = "player starting from position " + str(cur_position) + " and rolled " + str(roll) + "\n"
				message.append(temp)
				while roll > 0:
					temp = "space " + str(cur_position) + "\n"
					message.append(temp)
					if cur_position == -1:
						college = random.randint(0,1)
						if college == 1:
							temp = "player is going to college\n"
							message.append(temp)
							cur_position = 0
						else: 
							temp =  "player starting career\n"
							message.append(temp)
							career_one = random.randint(8,15)
							c_one_taken = False
							while c_one_taken == False:
								if career_one in taken_career:
									career_one = random.randint(8,15)
								else:
									c_one_taken = True

							career_two = random.randint(8,15)
							c_two_taken = False
							while c_two_taken == False:
								if career_two in taken_career or career_one == career_two:
									career_two = random.randint(8,15)
								else:
									c_two_taken = True

							if(careers[career_one].salary >= careers[career_two].salary):
								p.career = career_one
								taken_career.append(career_one)
								temp = "player is taking career " + str(career_one) + "\n"
								message.append(temp)
							else:
								p.career = career_two
								taken_career.append(career_two)
								temp = "player is taking career " + str(career_two) + "\n"
								message.append(temp)


							cur_position = 11
					elif cur_position == 10:
						temp = "end of college fork\n"
						message.append(temp)
						ccareer_one = random.randint(0,7)
						cc_one_taken = False
						while cc_one_taken == False:
							if ccareer_one in taken_ccareer:
								ccareer_one = random.randint(8,15)
							else:
								cc_one_taken = True

						ccareer_two = random.randint(0,7)
						cc_two_taken = False
						while cc_two_taken == False:
							if ccareer_two in taken_career or ccareer_one == ccareer_two:
								ccareer_two = random.randint(8,15)
							else:
								cc_two_taken = True

						if(careers[ccareer_one].salary >= careers[ccareer_two].salary):
							p.career = ccareer_one
							taken_ccareer.append(ccareer_one)
							temp = "player is taking career " + str(ccareer_one) + "\n"
							message.append(temp)
						else:
							p.career = ccareer_two
							taken_ccareer.append(ccareer_two)
							temp = "player is taking career " + str(ccareer_two) + "\n"
							message.append(temp)
						cur_position = 13
					elif cur_position == 36:
						family = random.randint(0,1)
						if family == 1:
							temp =  "player takes family route\n"
							message.append(temp)
							cur_position = 37
						else:
							temp = "player doesn't take family route\n"
							message.append(temp)
							cur_position = 46
					elif cur_position == 45:
						temp =  "end of family fork\n"
						message.append(temp)
						cur_position = 50
					elif cur_position == 73:
						risky = random.randint(0,1)
						if risky == 1:
							temp = "player takes risky route\n"
							message.append(temp)
							cur_position = 74
						else:
							temp = "player takes safe route\n"
							message.append(temp)
							cur_position = 78
					elif cur_position == 77:
						temp = "end of risky fork\n"
						message.append(temp)
						cur_position = 82
					elif cur_position == 89:
						temp = "player " + p.name + " has retired\n"
						message.append(temp)
						p.done = True
						roll = 0
						end_of_game = end_of_game + 1
					else:
						cur_position = cur_position + 1

					roll = roll - 1

					if cur_position in board.paydays:
						# need to have salary
						p.bankroll = p.bankroll + careers[p.career].salary 
						temp = "player " + p.name + " got paid and now has " + str(p.bankroll) + " dollars\n"
						message.append(temp)
				p.position = cur_position
				temp = "player ends turn on space " + str(p.position) + "\n"
				message.append(temp)

			else:
				temp = "player is already retired\n"
				message.append(temp)


	return render_template('create_game.html',message=message, careers=careers)



