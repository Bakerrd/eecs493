    
function log(msg) { //Used for outputting
    setTimeout(function() {
        throw new Error(msg);
    }, 0);
}


// Game Class
function Game() {
	this.players = [];
	for(i=0; i < 4; i++){
		var player = Player(i.toString());
		this.players.push(player);
	}
	this.board = Board();
	this.end_of_game = 0;
	this.curPlayer = 0;
	this.taken_career = [];
	this.taken_ccareer = [];
	this.taken_house = [];

	// Careers and Houses????
	this.careers = [];
	this.houses = [];

	this.Play_Game();
}

Game.prototype = {
Play_Game:function(){
	while (!this.Check_End_Game){
		for (var i=0; i<4; i++){
			this.curPlayer = i;
			this.Start_Turn();
		}
	}
},
Start_Turn:function() {
	//Render Spinner, get spinner value
	var spinnerVal = Math.floor(Math.random() * 11);
	this.Play_Turn(this.players[this.curPlayer], spinnerVal);
},
random_child:function() {
	var children = Math.floor((Math.random() * 21));
	if(children >= 0 && children < 12)
		return 1;
	else if(children >= 12 && children < 17)
		return 2;
	else if children >= 17 and children < 20:
		return 3;
	else:
		return 8;
},
Prompt_College_Career:function(player) {
	//Creates Dialog Box with generate and select buttons
	//Connect Generate with Generate_Regular_Career
	//Connect Select with choose_career_script(selectedVal)
},
Prompt_Regular_Career:function(player) {
	//Creates Dialog Box with generate and select buttons
	//Connect Generate button with Generate_Regular_Career
	//Connect Select with choose_career_script(selectedVal)
},
Prompt_House:function(player) {
	//Creates Dialog Box with generate and select buttons
	//Connect Generate button with Generate_House_Options
	//Connect Select with choose_house_script(selectedVal)
},
Generate_House_Options:function(player) {
	//Render Spinner, get spinner value
	var house_one = Math.floor((Math.random() * 10));
	var house_one_taken = false;
			while (house_one_taken == false){
				if($.inArray(house_one, this.taken_house)) //Checks if house one is taken
					house_one = Math.floor((Math.random() * 10));
				else
					house_one_taken = true;
			}
	var house_two = Math.floor((Math.random() * 10));
	var house_two_taken = false;
	while (house_two_taken == False){
		if($.inArray(house_one, this.taken_house) || house_one == house_two)
			house_two = Math.floor((Math.random() * 10));
		else
			house_two_taken = true;
	}

	
	
	$('p:first').html('House 1: '+this.houses[house_one].toString()+' <br> Cost: '+this.houses[house_one].cost);
			//Insert Button for select 1
	$('p:second').html('House 2: '+this.houses[house_two].toString()+' <br> Cost: '+this.houses[house_two].cost);

},
Choose_Career_Script:function(p, career_choice) {
	this.players[p].career = this.careers[career_choice].toString();
	this.players[p].salary = this.careers[career_choice].salary;
	if(career_choice <= 7){
		this.players[p].pay_square = career_choice + 3;
		this.taken_career.append(career_choice);
	}
	else{
		this.players[p].pay_square = career_choice - 5;
		this.taken_ccareer.append(career_choice);
	}
	
	var temp = "player " + this.players[p].name + " is taking career " + career_choice.toString() + "\n";
	log(temp);
},
Choose_House_Script:function(p, house_choice) {
	//Sets the player up with the selected house
	this.players[p].house = house_choice;
	this.taken_house.append(house_choice);
	var temp = "player " + this.players[p].name + " bought house " + this.houses[house_choice].name.toString() + " for $" + this.houses[house_choice].cost.toString() + "\n";
	log(temp);
	this.players[p].updateBankroll(this.houses[house_choice].cost);
},
Generate_Regular_Career:function(p) {
	//Render Spinner, get spinner value
	var career_one = Math.floor((Math.random() * 8) + 8);
	var c_one_taken = false;
	while(c_one_taken == false){
		if($.inArray(career_one, this.taken_career))
			career_one = Math.floor((Math.random() * 8) + 8);
		else
			c_one_taken = true;
	}
	var career_two = Math.floor((Math.random() * 8) + 8);
	var c_two_taken = false;
	
	while(c_two_taken == false){
		if($.inArray(career_one, this.taken_career) || career_one == career_two)
			career_two = Math.floor((Math.random() * 8) + 8);
		else
			c_two_taken = true;
	}
	$('p:first').html('Career 1: '+this.careers[career_one].title+' <br> Salary: '+this.careers[career_one].salary);
	//Insert Button for select 1
	$('p:second').html('Career 2: '+this.careers[career_two].title+' <br> Salary: '+this.careers[career_two].salary);
	//Choose_Career(p, career_one, career_two, false);					
},
Generate_College_Career:function(p) {
	//Render Spinner, get spinner value
	var temp = "end of college fork\n";
	log(temp);
	var ccareer_one = Math.floor((Math.random() * 8));
	var cc_one_taken = false;
	//College Career
	while(cc_one_taken == false){
		if($.inArray(ccareer_one, this.taken_ccareer))
			ccareer_one = Math.floor((Math.random() * 8));
		else
			cc_one_taken = true;
	}
	var ccareer_two = Math.floor((Math.random() * 8));
	var	cc_two_taken = false;
	while(cc_two_taken == false){
		if($.inArray(ccareer_two, this.taken_ccareer) || ccareer_one == ccareer_two)
			ccareer_two = Math.floor((Math.random() * 8));
		else
			cc_two_taken = true;
	}
	$('p:first').html('Career 1: '+this.careers[ccareer_one].title+' <br> Salary: '+this.careers[ccareer_one].salary);
	//Insert Button for select 1
	$('p:second').html('Career 2: '+this.careers[ccareer_two].title+' <br> Salary: '+this.careers[ccareer_two].salary);
	//Choose_Career(p, ccareer_one, ccareer_two, true);
},
College_Prompt:function(p) {
	var college = windowPromptVal;
	if(college == 1){
		var temp = "player " + p.name + " is going to college\n"
		log(temp);
		p.updateBankroll(-125000);
		temp = "player " + p.name + " had to pay $125000 to go to college\n"
		log(temp);
		return true;
	} else {
		var temp =  "player " + p.name + " is starting career\n";
		log(temp);
		this.Prompt_Regular_Career(p);
		return false;
	}
},
Play_Turn:function(p, roll) {
	var temp = "starting player " + p.name + "'s turn\n";
	log(temp);
	if (p.done == false){
		var cur_position = p.position;
		//Need to get roll from spinner
		// roll = Math.floor((Math.random() * 10) + 1);
		for(q in this.players){
			if p != q{
				if (roll == q.pay_square){
					p.updateBankroll(-20000);
					q.updateBankroll(20000);
					temp = "Player " + p.name + " paid Player " + q.name + " $20000";
					log(temp); 
				}
			}
		}
		temp = "player " + p.name + " starting from position " + cur_position.toString() + " and rolled " + roll.toString() + "\n";
		log(temp);
		while (roll > 0){
			//College Path
			if(cur_position == -1){ //Start of Game, college or not college
				if(p.expelled == false)
					if(!this.College_Prompt(p)) //Gets if wants to attend college true = yes, false = no, if false move to 11, runs prompt
						cur_position = 11;
					else
						cur_position = 0; // Goes through college path
			}	
			else if(cur_position == 10){
				temp = "end of college fork\n";
				log(temp);
				this.Prompt_College_Career(p);
				cur_position = 13;
			}
			//Family Road
			else if(cur_position == 36){
				var family = Math.floor((Math.random() * 2)));
				if(family == 1){
					temp =  "player " + p.name + " takes family route\n";
					// Remarried
					log(temp);
					if p.married == False:
						p.married = true;
						temp = "player " + p.name + " got remarried\n";
						log(temp);
					cur_position = 37;
				} else {
					temp = "player " + p.name + " doesn't take family route\n";
					log(temp);
					cur_position = 46;
				}
			}
			else if(cur_position == 45){
				temp =  "end of family fork\n";
				log(temp);
				cur_position = 50;
			}
			//Risky Road
			else if(cur_position == 73){
				risky = Math.floor((Math.random() * 2)))
				if (risky == 1){
					temp = "player takes risky route\n";
					log(temp);
					cur_position = 74;
				} else {
					temp = "player takes safe route\n";
					log(temp);
					cur_position = 78;
				}
			}
			else if(cur_position == 77){
				temp = "end of risky fork\n";
				log(temp);
				cur_position = 82;
			}
			//Retirement
			else if(cur_position == 89){
				temp = "player " + p.name + " has retired\n";
				log(temp);
				roll = 0;
				this.end_of_game = this.end_of_game + 1;
				p.end_game(this.houses[p.house].sell_price);
				temp = "after dealing with kids/house, player " + p.name + " has $" + p.bankroll.toString();
				log(temp);
			}
			//Guarenteed Marriage
			else if(cur_position == 25){
				p.marriage();
				temp = "player " + p.name + " has just married an English Major\n";
				log(temp);
				cur_position = cur_position + 1;
			}
			//Guaranteed random number of children
			else if(cur_position == 45){
				var num_children = random_child();
				temp = "player " + p.name + " just had " + num_children.toString() + " children\n";
				log(temp);
				p.add_children(num_children);
			}
			else //End of conditionals
				cur_position = cur_position + 1;

			roll = roll - 1;

			//check if the space is a payday

			if(this.board.tiles[cur_position].payday){
				//need to have salary
				p.updateBankroll(p.salary);
				temp = "player " + p.name + " got paid and now has " + p.bankroll.toString() + " dollars\n";
				log(temp);
			}
		p.position = cur_position;
		}///END OF WHILE LOOP FOR ROLL > 0
		
		this.End_Turn(p, cur_position);
	} else {
		temp = "player is already retired\n";
		log(temp);
	}
},
End_Turn:function(p, cur_position){
	// Non special spaces
	var temp = "";
	if ($.inArray(p.position, this.board.special)){
		p.bankroll += this.board.tiles[p.position].value;
		temp = " player " + p.name + " landed on a non special tile and got $" + this.board.tiles[p.position].value.toString() + "\n";
		log(temp);
	}

	// Random number of children
	if (cur_position == 4 || cur_position == 26){
		var num_children = random_child();
		temp = "player " + p.name + " just had " + num_children.toString() + " children\n";
		log(temp);
		p.add_children(num_children);
		// Dropout
		if (cur_position == 4){
			p.expel();
			temp = "player " + p.name + " dropped out of school to take care of their child\n";
			log(temp);
		}
	}

	// Child
	if (cur_position == 38 || cur_position == 43){
		p.add_children(1);
		temp = "player " + p.name + " has had a child\n";
		log(temp);
	}

	// Twins
	if (cur_position == 39 || cur_position == 44){
		p.add_children(2);
		temp = "player " + p.name + " has had twins\n";
		log(temp);
	}

	// Triplets
	if (cur_position == 42){
		p.add_children(3);
		temp = "player " + p.name + " has had triplets\n";
		log(temp);
	}

	// Player set upon by loan sharks
	if (cur_position == 18 || cur_position == 34 || cur_position == 66){
		if (p.loan_counter > 0){
			p.loan_counter = 1;
			temp = "The loan sharks have come collecting! Player " + p.name + " has to pay off their loans this turn!\n";
			log(temp);
		}
	}

	// Player gets a divorce
	if (cur_position == 52 || cur_position == 28 || cur_position == 60){
		p.divorce();
		temp = "Player " + p.name + " got caught cheating and got a divorce\n";
		log(temp);
	}

	// Player gets remarried
	if (cur_position == 56){
		p.marriage();
		temp = "Player " + p.name + " got remarried\n";
		log(temp);
	}

	// Player is expelled
	if (cur_position == 7){
		p.expel();
		temp = "Player " + p.name + " was expelled\n";
		log(temp);
	}

	// Player pays money for children, gets money from spouse
	if (cur_position <= 73){
		temp = "player " + p.name + " has $" + p.bankroll.toString();
		log(temp);
		p.children_spouse();
		temp = "player " + p.name + " had to pay for "  + p.children.toString() + " children in child support\n";
		log(temp);
		if (p.married == true){
			temp = "player " + p.name + " got money from their spouse. Now has $" + p.bankroll.toString();
			log(temp);
		}
	}

	// Update loan_counter
	if (p.loan_counter > 0){
		p.loan_counter = p.loan_counter - 1;
		temp = "player " + p.name + " has to pay off their loan in " + p.loan_counter.toString() + " turns\n";
		log(temp);
	}

	// Player pays off loans
	if (p.loan_counter == 0){
		var loan_cost = 175000*p.num_loans;
		p.bankroll -= loan_cost;
		p.num_loans = 0;
		p.loan_counter = -1;
		temp = "player " + p.name + " had to pay off their loan for $" + loan_cost.toString() + ". player " + p.name + " now has $" + p.bankroll.toString() + "\n";
		log(temp);
	}

	// Player buys a house
	if (p.children > 0 || p.married == true) && (p.house == -1){
		this.Prompt_House(p);
	}

	var counter = 0;
	var turns = 0;
	// Player takes out loans until they have positive $$
	if (p.done == false){
		p.get_loans();
		var amount = p.num_loans * 150000;
		var back = p.num_loans * 175000;
		temp = "player " + p.name + " now has " + p.num_loans.toString() + " for a total of $" + amount.toString() + ". They will need to pay $" + back.toString() + " back in " + p.loan_counter.toString() + " turns";
		log(temp);
	}

	///END OF WHILE LOOP FOR ROLL > 0
	temp = "player ends turn on space " + p.position.toString() + " and has $" + p.bankroll.toString() + "\n";
	log(temp);
	if (p.done == true && p.bankroll > 1000000){
		temp = "player " + p.name + " has moved to the Caymans\n";
		log(temp);
	}
},
Check_End_Game:function(){
	var end = true;
	for (var i=0; i<this.players.length; i++){
		if (this.players[i].done == false){
			end = false;
		}
	}
	return end;
}
};


// Player Class 
function Player(name) {
	this.done = false;
	this.bankroll = 10000;
	this.position = -1;
	this.name = name;
	this.career = null;
	this.married = false;
	this.children = 0;
	this.loan_counter = -1;
	this.expelled = false;
	this.num_loans = 0;
	this.house = -1;
	this.pay_square = -1;
}

Player.prototype = {
add_children:function(val){
	this.children = this.children + val;
}, 
expel:function(){
	this.expelled = true;
	this.position = -1;
},
children_spouse:function(){
	var child_support = this.children * 10000;
	this.bankroll -= child_support;
	if (this.married == true){
		this.bankroll += 20000;
	}
}, 
end_game:function(val){
	this.bankroll += val;
	if (this.loan_counter > 0){
		this.loan_counter = 1;
	}
	var child_money = this.children * 50000;
	this.bankroll += child_money;
	this.done = true;
}, 
marriage:function(){
	this.married = true;
}, 
divorce:function(){
	this.married = false;
}, 
get_loans:function(){
	var counter = 0;
	var turns = 0;
	while (this.bankroll < 0){
		this.bankroll += 150000;
		this.num_loans++;
		if (this.loan_counter > 0){
			if (counter > 0){
				turns = 1;
			} else {
				turns = 2;
			}
			this.loan_counter += turns;
		} else {
			this.loan_counter = 2;
		}
		counter++;
	}
}, 
updateBankroll:function(val){
	this.bankroll += val;
}
};


// Tile Class
function Tile(title, value, payday, special) {
	this.title = title;
	this.value = value;
	this.payday = payday;
	this.special = special;
}


// Board Class
function Board(){
	this.tiles = [];
	this.paydays = [12, 21, 31, 40, 48, 54, 64, 70, 76, 79];
	this.special = [4,7,12,18,21,25,26,28,31,34,37,38,39,40,42,43,44,45,48,52,54,56,60,64,66,70,76,79];
	for(int i = 0; i < 90; i++){
		var title = "tile " + i.toString();
		var new_tile = Tile(title, 10000);
		this.tiles.push(new_tile);
	}
}

