var this_game = new Game();


function log(msg) { //Used for outputting
    console.log(msg);
}

function show(id){
	document.getElementById(id).style.visibility = "visible";
}

function hide(id){
	document.getElementById(id).style.visibility = "hidden";
}

// Career Class
function Career(name, salary, img_path){
	this.title = name;
	this.salary = salary;
	this.img_path = img_path;
}

// House Class
function House(title, cost, sell_price, img_path){
	this.title = title;
	this.cost = cost;
	this.sell_price = sell_price;
	this.img_path = img_path;
}

// Player Class 
function Player(name, index) {
	this.done = false;
	this.index = index;
	this.bankroll = 10000;
	this.position = -1;
	this.name = name;
	this.career = null;
	this.married = false;
	this.children = 0;
	this.loan_counter = 0;
	this.expelled = false;
	this.num_loans = 0;
	this.house = null;
	this.pay_square = -1;
	this.risky = false;
	this.family = false;
	this.college = false;
}

Player.prototype.init_popup = function(){
	document.getElementById("p" + this.name + "_hover_br").innerHTML = this.bankroll;
	document.getElementById("p" + this.name + "_hover_loans").innerHTML = this.loan_counter;
	document.getElementById("p" + this.name + "_hover_career").innerHTML = "N/A";
	document.getElementById("p" + this.name + "_hover_married").innerHTML = "No";
	document.getElementById("p" + this.name + "_hover_children").innerHTML = this.children;
	document.getElementById("p" + this.name + "_hover_house").innerHTML = "N/A";
};

Player.prototype.add_children = function(val){
	this.children = this.children + val;
};
Player.prototype.expel = function(){
	this.expelled = true;
	this.position = -1;
};
Player.prototype.children_spouse = function(){
	var child_support = (this.children * 10000) * -1;
	this.updateBankroll(child_support);
	if (this.married == true){
		this.updateBankroll(20000);
	}
};
Player.prototype.end_game = function(val){
	this.updateBankroll(val);
	if (this.loan_counter > 0){
		this.loan_counter = 1;
	}
	var child_money = this.children * 50000;
	this.updateBankroll(child_money);
	this.done = true;
};
Player.prototype.marriage = function(){
	this.married = true;
}; 
Player.prototype.divorce = function(){
	this.married = false;
};
Player.prototype.get_loans = function(){
	var counter = 0;
	var turns = 0;
	while (this.bankroll < 0){
		this.updateBankroll(150000);
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
};
Player.prototype.updateBankroll = function(val){
	this.bankroll += val;
	var id = "";
	var id2 = "";
	if (this.name == "0"){
		id = "p0_bank";
		id2 = "p0_hover_br";
	} else if (this.name == "1"){
		id = "p1_bank";
		id2 = "p1_hover_br";
	} else if (this.name == "2"){
		id = "p2_bank";
		id2 = "p2_hover_br";
	} else if (this.name == "3"){
		id = "p3_bank";
		id2 = "p3_hover_br";
	}
	document.getElementById(id).innerHTML = this.bankroll;
	document.getElementById(id2).innerHTML = this.bankroll;

};


// Tile Class
function Tile(title, value, x, y) {
	this.title = title;
	this.value = value;
	this.x = x;
	this.y = y;
}

// Board Class
function Board(){
	this.tiles = [];
	this.paydays = [12, 21, 31, 40, 48, 54, 64, 70, 76, 79];
	this.special = [4,7,12,18,21,25,26,28,31,34,37,38,39,40,42,43,44,45,48,52,54,56,60,64,66,70,76,79];
}

// Game Class
function Game() {
	this.players = [];
	for(i=0; i < 4; i++){
		var player = new Player(i.toString());
		this.players.push(player, i);
	}
	this.board = new Board();
	this.end_of_game = 0;
	this.curPlayer = 0;
	this.taken_career = [];
	this.taken_ccareer = [];
	this.taken_house = [];

	this.careers = [];
	this.houses = [];
}

Game.prototype.Play_Game = function() {
	console.log("play_game");
	var end = this.Check_End_Game();
	while (!end){
		for (var i=0; i<4; i++){
			this.curPlayer = i;
			this.Start_Turn();
		}
		end = this.Check_End_Game();
	}
};

Game.prototype.Start_Turn = function() {
	//Render Spinner, get spinner value
	this.load_active_stats();
	var spinnerVal = Math.floor(Math.random() * 11);
	console.log("start_turn with spin of " + spinnerVal.toString()); 
	this.Play_Turn(this.players[this.curPlayer], spinnerVal);
};

Game.prototype.load_active_stats = function() {
	var p = this.players[this.curPlayer];
	document.getElementById('active_player').innerHTML = p.name;
	document.getElementById('active_br').innerHTML = p.bankroll;
	document.getElementById('active_loans').innerHTML = p.loan_counter;
	document.getElementById('active_career').innerHTML = p.career;
	document.getElementById('active_married').innerHTML = p.married;
	document.getElementById('active_children').innerHTML = p.children;
	document.getElementById('active_house').innerHTML = p.house;
};

Game.prototype.random_child = function() {
	var children = Math.floor((Math.random() * 21));
	if(children >= 0 && children < 12)
		return 1;
	else if(children >= 12 && children < 17)
		return 2;
	else if (children >= 17 && children < 20)
		return 3;
	else
		return 8;
};

Game.prototype.Prompt_College_Career = function(player) {
	//Creates Dialog Box with generate and select buttons
	//Connect Generate with Generate_Regular_Career
	//Connect Select with choose_career_script(selectedVal)
	var prompt= document.getElementById('ChooseCareerModal'); //? 	 	
	prompt.hidden = "false";
	$scope.curPlayer = player.index; 
};

Game.prototype.Prompt_Regular_Career = function(player) {
	//Creates Dialog Box with generate and select buttons
	//Connect Generate button with Generate_Regular_Career
	//Connect Select with choose_career_script(selectedVal)
	var prompt= document.getElementById('ChooseCareerModal'); //? 	 	
	prompt.hidden = "false";
	$scope.curPlayer = player.index; 
};

Game.prototype.Prompt_Risky_Road = function(p){
	var prompt= document.getElementById('riskyModal'); //?
	prompt.hidden = "false";
	$scope.curPlayer = player.index; 
	var risky = Math.floor((Math.random() * 2));
		if (risky == 1){
			return true;
			} 
		else {
			return false;
		}
};

Game.prototype.Prompt_Family_Road = function(p){
	var prompt= document.getElementById('familyModal'); //?
	prompt.hidden = "false";
	$scope.curPlayer = player.index; 
	var family = Math.floor((Math.random() * 2));
		if (family == 1){
			return true;
			} 
		else {
			return false;
		}
};

Game.prototype.Choose_Risky_Road = function(response){
	p = this_game.players[this_game.curPlayer];
	if(response)
		p.risky = true;
	else
		p.risky = false;
};

Game.prototype.Choose_Family_Road = function(response){
	p = this_game.players[this_game.curPlayer];
	if(response)
		p.family = true;
	else
		p.family = false;
};

Game.prototype.Prompt_House = function(player) {
	//Creates Dialog Box with generate and select buttons
	//Connect Generate button with Generate_House_Options
	//Connect Select with choose_house_script(selectedVal)
};

Game.prototype.Generate_House_Options = function() {
	//Render Spinner, get spinner value
	var house_one = Math.floor((Math.random() * 10));
	var house_one_taken = false;
			while (house_one_taken == false){
				if(house_one in this.taken_house) //Checks if house one is taken
					house_one = Math.floor((Math.random() * 10));
				else
					house_one_taken = true;
			}
	var house_two = Math.floor((Math.random() * 10));
	var house_two_taken = false;
	while (house_two_taken == false){
		if((house_one in this.taken_house) || (house_one == house_two))
			house_two = Math.floor((Math.random() * 10));
		else
			house_two_taken = true;
	}

	var lTitle= document.getElementById('left_house_title');
	lTitle.textContent = this_game.houses[house_one].title;
	var lCost= document.getElementById('left_house_cost');
	lCost.textContent = this_game.houses[house_one].cost;
	var lSell= document.getElementById('left_house_sellprice');
	lSell.textContent = this_game.houses[house_one].sell_price;
	var lImage= document.getElementById('left_house_img').src = this_game.houses[house_one].img_path;
	///Set up right career in prompt
	var rTitle= document.getElementById('right_house_title');
	rTitle.textContent = this_game.houses[house_two].title;
	var rCost= document.getElementById('right_house_cost');
	rCost.textContent = this_game.houses[house_two].cost;
	var rSell= document.getElementById('right_house_sellprice');
	rSell.textContent = this_game.houses[house_two].sell_price;
	var rImage= document.getElementById('right_house_img').src = this_game.houses[house_two].img_path;

};
Game.prototype.Choose_Career_Script = function(career_choice) {
	p = this.players[this.curPlayer];
	if (career_choice == 0){
		var career = document.getElementById('leftTitle').textContent;
		for (i=0; i<this_game.careers.length; i++){
			if (career == this_game.careers[i].title){
				p.career = this_game.careers[i];
			}
		}
	} else {
		var career = document.getElementById('rightTitle').textContent;
		for (i=0; i<this_game.careers.length; i++){
			if (career == this_game.careers[i].title){
				p.career = this_game.careers[i];
			}
		}
	}

	console.log("player " + p.name + " has chosen career: " + p.career.title);
};
Game.prototype.Choose_House_Script = function(house_choice) {
	//Sets the player up with the selected house
	p = this.players[this.curPlayer];
	if (house_choice == 0){
		var house = document.getElementById('left_house_title').textContent;
		for (i=0; i<this_game.houses.length; i++){
			if (house == this_game.houses[i].title){
				p.house = this_game.houses[i];
				p.updateBankroll(p.house.cost*-1);
			}
		}
	} else {
		var house = document.getElementById('right_house_title').textContent;
		for (i=0; i<this_game.houses.length; i++){
			if (house == this_game.houses[i].title){
				p.house = this_game.houses[i];
				p.updateBankroll(p.house.cost*-1);
			}
		}
	}

	console.log("player " + p.name + " has chosen house " + p.house.title + " for a cost of $" + p.house.cost.toString());
};
Game.prototype.Generate_Regular_Career = function() {
	//Render Spinner, get spinner value
	var career_one = Math.floor((Math.random() * 8) + 8);
	var c_one_taken = false;
	while(c_one_taken == false){
		if(career_one in this.taken_career)
			career_one = Math.floor((Math.random() * 8) + 8);
		else
			c_one_taken = true;
	}
	var career_two = Math.floor((Math.random() * 8) + 8);
	var c_two_taken = false;
	
	while(c_two_taken == false){
		if((career_one in this.taken_career) || (career_one == career_two))
			career_two = Math.floor((Math.random() * 8) + 8);
		else
			c_two_taken = true;
	}

	///Set up left career in prompt
	var lTitle= document.getElementById('left_career_title');
	lTitle.textContent = this.careers[career_one].title;
	var lSalary= document.getElementById('left_career_salary');
	lSalary.textContent = this.careers[career_one].salary;
	var lImage= document.getElementById('left_career_img').src = this.careers[career_one].img_path;
	///Set up right career in prompt
	var rTitle= document.getElementById('right_career_title');
	rTitle.textContent = this.careers[career_two].title;
	var rSalary= document.getElementById('right_career_salary');
	rSalary.textContent = this.careers[career_two].salary;
	var rImage= document.getElementById('right_career_img').src = this.careers[career_two].img_path;
					
};
Game.prototype.Generate_College_Career = function() {
	//Render Spinner, get spinner value
	var temp = "end of college fork\n";
	console.log(this.careers);
	log(temp);
	var ccareer_one = Math.floor((Math.random() * 8));
	var cc_one_taken = false;
	//College Career
	while(cc_one_taken == false){
		if(ccareer_one in this.taken_ccareer)
			ccareer_one = Math.floor((Math.random() * 8));
		else
			cc_one_taken = true;
	}
	var ccareer_two = Math.floor((Math.random() * 8));
	var	cc_two_taken = false;
	while(cc_two_taken == false){
		if((ccareer_two in this.taken_ccareer) || (ccareer_one == ccareer_two))
			ccareer_two = Math.floor((Math.random() * 8));
		else
			cc_two_taken = true;
	}

	var lTitle= document.getElementById('left_career_title');
	lTitle.textContent = this.careers[ccareer_one].title;
	var lSalary= document.getElementById('left_career_salary');
	lSalary.textContent = this.careers[ccareer_one].salary;
	var lImage= document.getElementById('left_career_img').src = this.careers[ccareer_one].img_path;

	var rTitle= document.getElementById('right_career_title');
	rTitle.textContent = this.careers[ccareer_two].title;
	var rSalary= document.getElementById('right_career_salary');
	rSalary.textContent = this.careers[ccareer_two].salary;
	var rImage= document.getElementById('right_career_img').src = this.careers[ccareer_two].img_path;

};
Game.prototype.College_Prompt = function(p) {
	var college = Math.floor(Math.random() * 2);
	if(college == 1){
		var temp = "player " + p.name + " is going to college\n"
		log(temp);
		p.updateBankroll(-125000);
		temp = "player " + p.name + " had to pay $125000 to go to college\n"
		p.college = true;
		log(temp);
		return true;
	} else {
		var temp =  "player " + p.name + " is starting career\n";
		log(temp);
		this.Prompt_Regular_Career(p);
		return false;
	}
};
Game.prototype.Play_Turn =function(p, roll) {
	var temp = "starting player " + p.name + "'s turn\n";
	log(temp);
	if (p.done == false){
		var cur_position = p.position;
		//Need to get roll from spinner
		// roll = Math.floor((Math.random() * 10) + 1);
		for(q in this.players){
			if (p != q){
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
				//var family = Math.floor((Math.random() * 2));
				this.Prompt_Family_Road(p);
				if(p.family){
					temp =  "player " + p.name + " takes family route\n";
					// Remarried
					log(temp);
					if (p.married == false){
						p.married = true;
						temp = "player " + p.name + " got remarried\n";
						log(temp);
						cur_position = 37;
					}
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
				//risky = Math.floor((Math.random() * 2));
				this.Prompt_Risky_Road(p);
				if (p.risky){
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
};
Game.prototype.End_Turn = function(p, cur_position){
	// Non special spaces
	var temp = "";
	if ($.inArray(p.position, this.board.special)){
		p.updateBankroll(this.board.tiles[p.position].value);
		temp = " player " + p.name + " landed on a non special tile and got $" + this.board.tiles[p.position].value.toString() + "\n";
		log(temp);
	}

	// Random number of children
	if (cur_position == 4 || cur_position == 26){
		var num_children = this.random_child();
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
		p.updateBankroll(loan_cost*-1);
		p.num_loans = 0;
		p.loan_counter = -1;
		temp = "player " + p.name + " had to pay off their loan for $" + loan_cost.toString() + ". player " + p.name + " now has $" + p.bankroll.toString() + "\n";
		log(temp);
	}

	// Player buys a house
	if ((p.children > 0 || p.married == true) && (p.house == -1)){
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
	if(!($.inArray(p.position, this.board.special)) && !($.inArray(p.position, this.board.paydays))){
		var prompt = document.getElementById('tileModal');
		var tileTitle = document.getElementById('myModalLabel');
		tileTitle.textContent = this.tiles[p.position].title;
		var tileValue= document.getElementById('modal-body');
		tileValue.textContent = this.tiles[p.position].value;
		prompt.hidden = "false";
		p.updateBankroll(this.tiles[p.position].value);
	}
	log(temp);
	if (p.done == true && p.bankroll > 1000000){
		temp = "player " + p.name + " has moved to the Caymans\n";
		log(temp);
	}
};
Game.prototype.Check_End_Game = function(){
	var end = true;
	for (var i=0; i<this.players.length; i++){
		if (this.players[i].done == false){
			end = false;
		}
	}
	return end;
};

function New_Game(){
	console.log("you made it");
	this_game.Play_Game();
}


