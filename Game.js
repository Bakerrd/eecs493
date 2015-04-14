    
		function log(msg) { //Used for outputting
    setTimeout(function() {
        throw new Error(msg);
    }, 0);
}
	
	function Game() {
		this.players = []
		for i in range(0,4):
		player = AIPlayer(str(i));
		this.players.append(player);
		this.board = Board();
		this.end_of_game = 0;
		this.curPlayer = 0;
		this.taken_career = [];
		this.taken_ccareer = [];
		this.taken_house = [];

		careers = Careers.query.all();
		houses = Houses.query.all();
		}
	Game.prototype = {
    Start_Turn:function() {
		//Render Spinner, get spinner value
		Play_Turn(players[curPlayer], spinnerVal);
	}
	}
	Game.prototype = {
    Prompt_College_Career:function(player) {
		//Creates Dialog Box with generate and select buttons
		//Connect Generate with Generate_Regular_Career
		//Connect Select with choose_career_script(selectedVal)
	}
	}
	Game.prototype = {
	Prompt_Regular_Career:function(player) {
		//Creates Dialog Box with generate and select buttons
		//Connect Generate button with Generate_Regular_Career
		//Connect Select with choose_career_script(selectedVal)
	}
	}
	Game.prototype = {
	Prompt_House:function(player) {
		//Creates Dialog Box with generate and select buttons
		//Connect Generate button with Generate_House_Options
		//Connect Select with choose_house_script(selectedVal)
	}
	}

	Game.prototype = {
    Generate_House_Options:function(player) {
		//Render Spinner, get spinner value
			var house_one = random.randint(0,9);
			var house_one_taken = false;
					while( house_one_taken == false){
						if($.inArray(house_one, taken_house)) //Checks if house one is taken
							house_one = random.randint(0,9);
						else:
							house_one_taken = true;
					}
			var house_two = random.randint(0,9);
			var house_two_taken = false;
					while(house_two_taken == False)
						if($.inArray(house_one, taken_house) || house_one == house_two)
							house_two = random.randint(0,9);
						else
							house_two_taken = true;

			
			
			$('p:first').html('House 1: '+str(houses[house_one])+' <br> Cost: '+houses[house_one].cost);
					//Insert Button for select 1
			$('p:second').html('House 2: '+str(houses[house_two])+' <br> Cost: '+houses[house_two].cost);

	}
	}

		Game.prototype = {
    Choose_Career_Script:function(career_choice) {
			player.career = str(careers[career_choice]);
			player.salary = careers[career_choice].salary;
			if(career_choice <= 7){
				p.pay_square = career_choice + 3;
				taken_career.append(career_choice);
			}
			else{
				p.pay_square = career_choice - 5;
				taken_ccareer.append(career_choice);
			}
			
			temp = "player " + p.name + " is taking career " + str(career_choice) + "\n";
			log(temp);
			}
    }
}


		Game.prototype = {
    Choose_House_Script:function(house_choice) {
		//Dialog box with choices, test if price is > bankroll
		player.house = house_choice;
		taken_house.append(house_choice);
		temp = "player " + player.name + " bought house " + str(house_one) + " for $" + str(houses[house_one].cost) + "\n";
		log(temp);
		player.updateBankroll(chosen.val);
	}
	}

		Game.prototype = {
    Generate_Regular_Career:function(p) {
		//Render Spinner, get spinner value
		var career_one = random.randint(8,15);
		var c_one_taken = false;
		while(c_one_taken == false){
			if($.inArray(career_one, taken_career)
				career_one = random.randint(8,15);
			else:
				c_one_taken = true;
		}
		var career_two = random.randint(8,15)
		var c_two_taken = False
		
		while(c_two_taken == false){
			if($.inArray(career_one, taken_career) || career_one == career_two)
				career_two = random.randint(8,15);
			else:
				c_two_taken = true;
		}
		$('p:first').html('Career 1: '+careers[career_one].title+' <br> Salary: '+careers[career_one].salary);
		//Insert Button for select 1
		$('p:second').html('Career 2: '+careers[career_two].title+' <br> Salary: '+careers[career_two].salary);
		//Choose_Career(p, career_one, career_two, false);					
	}
	}
		Game.prototype = {
    Generate_College_Career:function(p) {
		//Render Spinner, get spinner value
		var temp = "end of college fork\n";
		log(temp);
		var ccareer_one = random.randint(0,7);
		var cc_one_taken = false;
		//College Career
		while(cc_one_taken == false){
			if($.inArray(ccareer_one, taken_ccareer)
				ccareer_one = random.randint(0,7);
			else
				cc_one_taken = true;
		}
		var ccareer_two = random.randint(0,7);
		var	cc_two_taken = false;
		while(cc_two_taken == false){
			if($.inArray(ccareer_two, taken_ccareer) || ccareer_one == ccareer_two)
				ccareer_two = random.randint(0,7);
			else:
				cc_two_taken = true;
		}
		$('p:first').html('Career 1: '+careers[ccareer_one].title+' <br> Salary: '+careers[ccareer_one].salary);
		//Insert Button for select 1
		$('p:second').html('Career 2: '+careers[ccareer_two].title+' <br> Salary: '+careers[ccareer_two].salary);
		//Choose_Career(p, ccareer_one, ccareer_two, true);
	}
	}

	Game.prototype = {
    College_Prompt:function(p) {
		var college = windowPromptVal;
		if(college == 1){
			temp = "player " + p.name + " is going to college\n"
			log(temp);
			cur_position = 0;
			p.updateBankroll(-125000);
			temp = "player " + p.name + " had to pay $125000 to go to college\n"
			log(temp);
			return true;
		}
			else{
				temp =  "player " + p.name + " is starting career\n";
				log(temp);
				Prompt_Regular_Career(p);
				return false;
			}
	}
	}

	Game.prototype = {
    Play_Turn:function(p, roll) {
		temp = "starting player " + p.name + "'s turn\n" 
			log(temp)
			if p.done == False:
				cur_position = p.position
				//Need to get roll from spinner
				roll = random.randint(1, 10)
				for(q in players){
						if p != q{
							if roll == q.pay_square:
								p.updateBankroll(-20000);
								q.updateBankroll(20000);
								temp = "Player " + p.name + " paid Player " + q.name + " $20000";
								log(temp); 
						}
				}
				temp = "player " + p.name + " starting from position " + str(cur_position) + " and rolled " + str(roll) + "\n";
				log(temp);
				while roll > 0{
					#College Path
					if(cur_position == -1){ //Start of Game, college or not college
						if(p.expelled == false)
							if(College_Prompt(p)) //Gets if wants to attend college
								cur_position = 11;
					}	
					else if( cur_position == 10){}
						temp = "end of college fork\n";
						log(temp);
						Prompt_College_Career(p);
						cur_position = 13;
					}
					#Family Road
					else if cur_position == 36:
						family = random.randint(0,1)
						if family == 1:
							temp =  "player " + p.name + " takes family route\n"
							#Remarried
							log(temp)
							if p.married == False:
								p.married = true
								temp = "player " + p.name + " got remarried\n"
								log(temp)
							cur_position = 37
						else:
							temp = "player " + p.name + " doesn't take family route\n"
							log(temp)
							cur_position = 46
					else if cur_position == 45:
						temp =  "end of family fork\n"
						log(temp)
						cur_position = 50

					#Risky Road
					else if cur_position == 73:
						risky = random.randint(0,1)
						if risky == 1:
							temp = "player takes risky route\n"
							log(temp)
							cur_position = 74
						else:
							temp = "player takes safe route\n"
							log(temp)
							cur_position = 78
					
					else if cur_position == 77:
						temp = "end of risky fork\n"
						log(temp)
						cur_position = 82

					#Retirement
					else if cur_position == 89:
						temp = "player " + p.name + " has retired\n"
						log(temp)
						roll = 0
						end_of_game = end_of_game + 1
						p.end_game(houses[p.house].sell_price)
						temp = "after dealing with kids/house, player " + p.name + " has $" + str(p.bankroll)
						log(temp)
					
					#Guarenteed Marriage
					else if cur_position == 25:
						p.marriage()
						temp = "player " + p.name + " has just married an English Major\n"
						log(temp)
						cur_position = cur_position + 1

					#Guaranteed random number of children
					else if cur_position == 45:
						num_children = random_child()
						temp = "player " + p.name + " just had " + str(num_children) + " children\n"
						log(temp)
						p.add_children(num_children)
						
					else:
						cur_position = cur_position + 1

					roll = roll - 1

					#check if the space is a payday
					if(cur_position in board.paydays{}
						# need to have salary
						p.updateBankroll(p.salary);
						temp = "player " + p.name + " got paid and now has " + str(p.bankroll) + " dollars\n"
						log(temp)

				p.position = cur_position

				#SQUARE YOU END ON

				#Non special spaces
				if p.position not in board.special:
					p.bankroll = p.bankroll + board.tiles[p.position].value
					temp = " player " + p.name + " landed on a non special tile and got $" + str(board.tiles[p.position].value) + "\n"
					log(temp)

				#Random number of children
				if cur_position == 4 or cur_position == 26:
					num_children = random_child()
					temp = "player " + p.name + " just had " + str(num_children) + " children\n"
					log(temp)
					p.add_children(num_children)
					#Dropout
					if cur_position == 4:
						p.expel()
						temp = "player " + p.name + " dropped out of school to take care of their child\n"
						log(temp)

				#Child
				if cur_position == 38 or cur_position == 43:
					p.add_children(1)
					temp = "player " + p.name + " has had a child\n"
					log(temp)

				#Twins
				if cur_position == 39 or cur_position == 44:
					p.add_children(2)
					temp = "player " + p.name + " has had twins\n"
					log(temp)

				#Triplets
				if cur_position == 42:
					p.add_children(3)
					temp = "player " + p.name + " has had triplets\n"
					log(temp)

				#Player set upon by loan sharks
				if cur_position == 18 or cur_position == 34 or cur_position == 66:
					if p.loan_counter > 0:
						p.loan_counter = 1
						temp = "The loan sharks have come collecting! Player " + p.name + " has to pay off their loans this turn!\n"
						log(temp)

				#Player gets a divorce
				if cur_position == 52 or cur_position == 28 or cur_position == 60:
					p.divorce()
					temp = "Player " + p.name + " got caught cheating and got a divorce\n"
					log(temp)

				#Player gets remarried
				if cur_position == 56:
					p.marriage()
					temp = "Player " + p.name + " got remarried\n"
					log(temp) 

				#Player is expelled
				if cur_position == 7:
					p.expel()
					temp = "Player " + p.name + " was expelled\n"
					log(temp)

				#Player pays money for children, gets money from spouse
				if cur_position <= 73:
					temp = "player " + p.name + " has $" + str(p.bankroll)
					log(temp)
					p.children_spouse()
					temp = "player " + p.name + " had to pay for "  + str(p.children) + " children in child support\n"
					log(temp)
					if p.married == true:
						temp = "player " + p.name + " got money from their spouse. Now has $" + str(p.bankroll)
						log(temp)

				#Update loan_counter
				if p.loan_counter > 0:
					p.loan_counter = p.loan_counter - 1
					temp = "player " + p.name + " has to pay off their loan in " + str(p.loan_counter) + " turns\n"
					log(temp)

				#Player pays off loans
				if p.loan_counter == 0:
					loan_cost = 175000*p.num_loans
					p.bankroll = p.bankroll - loan_cost
					p.num_loans = 0
					p.loan_counter = -1
					temp = "player " + p.name + " had to pay off their loan for $" + str(loan_cost) + ". player " + p.name + " now has $" + str(p.bankroll) + "\n"
					log(temp)

				#Player buys a house
				if (p.children > 0 or p.married == true) and p.house == -1:
					Generate_House_Options(p);

				counter = 0
				turns = 0
				#Player takes out loans until they have positive $$
				if p.done == False:
					p.get_loans()
					amount = p.num_loans * 150000
					back = p.num_loans * 175000
					temp = "player " + p.name + " now has " + str(p.num_loans) + " for a total of $" + str(amount) + ". They will need to pay $" + str(back) + " back in " + str(p.loan_counter) + " turns"
					log(temp)
				}///END OF WHILE LOOP FOR ROLL > 0
				temp = "player ends turn on space " + str(p.position) + " and has $" + str(p.bankroll) + "\n";
				log(temp);
				if p.done == true and p.bankroll > 1000000{
					temp = "player " + p.name + " has moved to the Caymans\n";
					log(temp);
				} 

			else:
				temp = "player is already retired\n"
				log(temp)

	}
	};
