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
							p.bankroll = p.bankroll - 125000
							temp = "player had to pay $125000 to go to college\n"
							message.append(temp)
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
							if p.married == False:
								p.married = True
								temp = "player got remarried\n"
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
						child_money = p.children * 50000
						p.bankroll = p.bankroll + child_money
						temp = "player " + p.name + " has made $" + str(child_money) + " by exploiting their children\n"
						message.append(temp)
						if p.loan_counter > 0:
							p.loan_counter = 1
					elif cur_position == 25:
						temp = "player " + p.name + " has just married an English Major\n"
						message.append(temp)
						p.married = True
						cur_position = cur_position + 1
					elif cur_position == 45:
						children = random.randint(0,20)
						if children >= 0 and children < 12:
							p.children = p.children + 1
							temp = "player " + p.name + " has had one child\n"
							message.append(temp)
						elif children >= 12 and children < 17:
							p.children = p.children + 2
							temp = "player " + p.name + " has had twins\n"
							message.append(temp)
						elif p.children >= 17 and p.children < 20:
							p.children = p.children + 3
							temp = "player " + p.name + " has had triplets\n"
							message.append(temp)
						else:
							p.children = p.children + 8
							temp = "player " + p.name + " has had eight children\n"
							message.append(temp)
						
					else:
						cur_position = cur_position + 1

					roll = roll - 1

					if cur_position in board.paydays:
						# need to have salary
						p.bankroll = p.bankroll + careers[p.career].salary 
						temp = "player " + p.name + " got paid and now has " + str(p.bankroll) + " dollars\n"
						message.append(temp)

				p.position = cur_position

				if cur_position == 4 or cur_position == 26:
					children = random.randint(0,20)
					if children >= 0 and children < 12:
						p.children = p.children + 1
					elif children >= 12 and children < 17:
						p.children = p.children + 2
					elif p.children >= 17 and p.children < 20:
						p.children = p.children + 3
					else:
						p.children = p.children + 8
					temp = "player " + p.name + " has had " + str(children) + " children\n"
					message.append(temp)

				if cur_position == 38 or cur_position == 43:
					p.children = p.children + 1
					temp = "player " + p.name + " has had a child\n"
					message.append(temp)

				if cur_position == 39 or cur_position == 44:
					p.children = p.children + 2
					temp = "player " + p.name + " has had twins\n"
					message.append(temp)

				if cur_position == 42:
					p.children = p.children + 3
					temp = "player " + p.name + " has had triplets\n"
					message.append(temp)

				if cur_position == 18 or cur_position == 34 or cur_position == 66:
					if p.loan_counter > 0:
						p.loan_counter = 1
						temp = "The loan sharks have come collecting! Player " + p.name + " has to pay off their loans this turn!\n"
						message.append(temp)

				if cur_position == 52 or cur_position == 28 or cur_position == 64:
					p.married = False
					temp = "Player " + p.name + " got caught cheating and got a divorce\n"
					message.append(temp)

				if cur_position == 56:
					p.married = True
					temp = "Player " + p.name + " got remarried\n"
					message.append(temp) 

				if cur_position <= 73:
					if p.married == True:
						p.bankroll = p.bankroll + 20000
						temp = "player " + p.name + "'s spouse got paid $20000. player " + p.name + " now has $" + str(p.bankroll) + "\n"
						message.append(temp)
					child_support = p.children
					child_support = child_support*10000
					p.bankroll = p.bankroll - child_support
					temp = "player " + p.name + " had to pay " + str(child_support) + " in child support\n"
					message.append(temp)

				if p.loan_counter > 0:
					p.loan_counter = p.loan_counter - 1
					temp = "player " + p.name + " has to pay off their loan in " + str(p.loan_counter) + " turns\n"
					message.append(temp)

				if p.loan_counter == 0:
					p.bankroll = p.bankroll - 175000
					temp = "player " + p.name + " had to pay off their loan. player " + p.name + " now has $" + str(p.bankroll) + "\n"
					message.append(temp)

				counter = 0
				turns = 0
				while p.bankroll < 0:
					p.bankroll = p.bankroll + 150000
					if p.loan_counter > 0:
						if counter > 0:
							turns = 1
						else: 
							turns = 2
						p.loan_counter = p.loan_counter + turns
					else:
						p.loan_counter = 2
					counter = counter + 1
					temp = "player " + p.name + " had to take out a loan for $150000. They have " + str(p.loan_counter) + " turns to pay it off\n"
					message.append(temp)

				temp = "player ends turn on space " + str(p.position) + " and has $" + str(p.bankroll) + "\n"
				message.append(temp)

			else:
				temp = "player is already retired\n"
				message.append(temp)


	max_money = -10000000000000
	winner = -1
	for p in players:
		if p.bankroll > max_money:
			winner = p.name
			max_money = p.bankroll

	temp = "Player " + p.name + " has won Life and finished with $" + str(max_money) + "\n"
	message.append(temp)

	return render_template('create_game.html',message=message, careers=careers)



