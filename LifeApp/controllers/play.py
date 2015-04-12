from flask import *

from ..models import *
from ..config import *
from helpers import *
from player import *
from static import *
from play_helper import *
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
	taken_house = []

	careers = Careers.query.all()
	houses = Houses.query.all()

	while end_of_game != 4:
		for p in players:
			temp = "\n\n"
			message.append(temp)
			temp = "starting player " + p.name + "'s turn\n" 
			message.append(temp)
			if p.done == False:
				cur_position = p.position
				roll = random.randint(1, 10)
				temp = "player " + p.name + " starting from position " + str(cur_position) + " and rolled " + str(roll) + "\n"
				message.append(temp)
				while roll > 0:
					if cur_position == -1:
						college = random.randint(0,1)
						if p.expelled == True:
							college = 0
						if college == 1:
							temp = "player " + p.name + " is going to college\n"
							message.append(temp)
							cur_position = 0
							p.bankroll = p.bankroll - 125000
							temp = "player " + p.name + " had to pay $125000 to go to college\n"
							message.append(temp)
						else: 
							temp =  "player " + p.name + " is starting career\n"
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
								temp = "player " + p.name + " is taking career " + str(career_one) + "\n"
								message.append(temp)
							else:
								p.career = career_two
								taken_career.append(career_two)
								temp = "player " + p.name + " is taking career " + str(career_two) + "\n"
								message.append(temp)


							cur_position = 11
					elif cur_position == 10:
						temp = "end of college fork\n"
						message.append(temp)
						ccareer_one = random.randint(0,7)
						cc_one_taken = False
						while cc_one_taken == False:
							if ccareer_one in taken_ccareer:
								ccareer_one = random.randint(0,7)
							else:
								cc_one_taken = True

						ccareer_two = random.randint(0,7)
						cc_two_taken = False
						while cc_two_taken == False:
							if ccareer_two in taken_career or ccareer_one == ccareer_two:
								ccareer_two = random.randint(0,7)
							else:
								cc_two_taken = True

						if(careers[ccareer_one].salary >= careers[ccareer_two].salary):
							p.career = ccareer_one
							taken_ccareer.append(ccareer_one)
							temp = "player " + p.name + " is taking career " + str(ccareer_one) + "\n"
							message.append(temp)
						else:
							p.career = ccareer_two
							taken_ccareer.append(ccareer_two)
							temp = "player " + p.name + " is taking career " + str(ccareer_two) + "\n"
							message.append(temp)
						cur_position = 13
					elif cur_position == 36:
						family = random.randint(0,1)
						if family == 1:
							temp =  "player " + p.name + " takes family route\n"
							message.append(temp)
							if p.married == False:
								p.married = True
								temp = "player " + p.name + " got remarried\n"
								message.append(temp)
							cur_position = 37
						else:
							temp = "player " + p.name + " doesn't take family route\n"
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
						roll = 0
						end_of_game = end_of_game + 1
						p.end_game(houses[p.house].sell_price)
						temp = "after dealing with kids/house, player " + p.name + " has $" + str(p.bankroll)
						message.append(temp)
					
					elif cur_position == 25:
						p.marriage()
						temp = "player " + p.name + " has just married an English Major\n"
						message.append(temp)
						cur_position = cur_position + 1
					elif cur_position == 45:
						num_children = random_child()
						temp = "player " + p.name + " just had " + str(num_children) + " children\n"
						message.append(temp)
						p.add_children(num_children)
						
					else:
						cur_position = cur_position + 1

					roll = roll - 1

					if cur_position in board.paydays:
						# need to have salary
						p.bankroll = p.bankroll + careers[p.career].salary 
						temp = "player " + p.name + " got paid and now has " + str(p.bankroll) + " dollars\n"
						message.append(temp)

				p.position = cur_position

				if p.position not in board.special:
					p.bankroll = p.bankroll + board.tiles[p.position].value
					temp = " player " + p.name + " landed on a non special tile and got $" + str(board.tiles[p.position].value) + "\n"
					message.append(temp)

				if cur_position == 4 or cur_position == 26:
					num_children = random_child()
					temp = "player " + p.name + " just had " + str(num_children) + " children\n"
					message.append(temp)
					p.add_children(num_children)
					if cur_position == 4:
						p.expel()
						temp = "player " + p.name + "dropped out of school to take care of their child\n"
						message.append(temp)

				if cur_position == 38 or cur_position == 43:
					p.add_children(1)
					temp = "player " + p.name + " has had a child\n"
					message.append(temp)

				if cur_position == 39 or cur_position == 44:
					p.add_children(2)
					temp = "player " + p.name + " has had twins\n"
					message.append(temp)

				if cur_position == 42:
					p.add_children(3)
					temp = "player " + p.name + " has had triplets\n"
					message.append(temp)

				if cur_position == 18 or cur_position == 34 or cur_position == 66:
					if p.loan_counter > 0:
						p.loan_counter = 1
						temp = "The loan sharks have come collecting! Player " + p.name + " has to pay off their loans this turn!\n"
						message.append(temp)

				if cur_position == 52 or cur_position == 28 or cur_position == 64:
					p.divorce()
					temp = "Player " + p.name + " got caught cheating and got a divorce\n"
					message.append(temp)

				if cur_position == 56:
					p.marriage()
					temp = "Player " + p.name + " got remarried\n"
					message.append(temp) 

				if cur_position == 7:
					p.expel()
					temp = "Player " + p.name + " was expelled\n"
					message.append(temp)

				if cur_position <= 73:
					temp = "player " + p.name + " has $" + str(p.bankroll)
					message.append(temp)
					p.children_spouse()
					temp = "player " + p.name + " had to pay for "  + str(p.children) + " children in child support\n"
					message.append(temp)
					if p.married == True:
						temp = "player " + p.name + " got money from their spouse. Now has $" + str(p.bankroll)
						message.append(temp)

				if p.loan_counter > 0:
					p.loan_counter = p.loan_counter - 1
					temp = "player " + p.name + " has to pay off their loan in " + str(p.loan_counter) + " turns\n"
					message.append(temp)

				if p.loan_counter == 0:
					loan_cost = 175000*p.num_loans
					p.bankroll = p.bankroll - loan_cost
					p.num_loans = 0
					p.loan_counter = -1
					temp = "player " + p.name + " had to pay off their loan for $" + str(loan_cost) + ". player " + p.name + " now has $" + str(p.bankroll) + "\n"
					message.append(temp)

				if (p.children > 0 or p.married == True) and p.house == -1:
					house_one = random.randint(0,9)
					house_one_taken = False
					while house_one_taken == False:
						if house_one in taken_house:
							house_one = random.randint(0,9)
						else:
							house_one_taken = True

					house_two = random.randint(0,9)
					house_two_taken = False
					while house_two_taken == False:
						if house_two in taken_house or house_one == house_two:
							house_two = random.randint(0,9)
						else:
							house_two_taken = True

					if(houses[house_one].cost >= houses[house_two].cost):
						p.house = house_one
						p.bankroll = p.bankroll - houses[house_one].cost
						taken_house.append(house_one)
						temp = "player " + p.name + " bought house " + str(house_one) + " for $" + str(houses[house_one].cost) + "\n"
						message.append(temp)
					else:
						p.house = house_two
						taken_house.append(house_two)
						p.bankroll = p.bankroll - houses[house_two].cost
						temp = "player " + p.name + " bought house " + str(house_two) + " for $" + str(houses[house_two].cost) + "\n"
						message.append(temp)

				counter = 0
				turns = 0
				if p.done == False:
					p.get_loans()
					amount = p.num_loans * 150000
					back = p.num_loans * 175000
					temp = "player " + p.name + " now has " + str(p.num_loans) + " for a total of $" + str(amount) + ". They will need to pay $" + str(back) + " back in " + str(p.loan_counter) + " turns"
					message.append(temp)

				temp = "player ends turn on space " + str(p.position) + " and has $" + str(p.bankroll) + "\n"
				message.append(temp)
				if p.done == True and p.bankroll > 1000000:
					temp = "player " + p.name + " has moved to the Caymans\n"
					message.append(temp) 

			else:
				temp = "player is already retired\n"
				message.append(temp)


	max_money = -10000000000000
	winner = -1
	for p in players:
		temp = "Player " + p.name + " finished with $" + str(p.bankroll) + "\n"
		message.append(temp)
		if p.bankroll > max_money:
			winner = p.name
			max_money = p.bankroll

	temp = "Player " + p.name + " has won Life and finished with $" + str(max_money) + "\n"
	message.append(temp)

	return render_template('create_game.html',message=message, careers=careers)



