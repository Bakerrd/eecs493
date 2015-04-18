var this_game = new Game();


function Move(x){
	this.showWaypoints = true;
	this.showTrail = true;
	this.data = [];
	this.num = x;
}

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
	this.salary = 0;
	this.married = false;
	this.children = 0;
	this.loan_counter = 0;
	this.expelled = false;
	this.num_loans = 0;
	this.house = null;
	this.pay_square = -1;
	this.risky = null;
	this.family = null;
	this.college = null;
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
	this.college = false;
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
	this.bankroll = (this.bankroll+val);
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
	for(i=0; i < 1; i++){
		var player = new Player(i.toString());
		this.players.push(player);
	}
	this.board = new Board();
	this.spin = 0;
	this.end_of_game = 0;
	this.curPlayer = 0;
	this.taken_career = [];
	this.taken_ccareer = [];
	this.taken_house = [];

	this.moves = [];
	for (i=0; i<1; i++){
		var move = new Move(i);
		this.moves.push(move);
	}

	this.turn_summary = "";

	this.careers = [];
	this.houses = [];
}

Game.prototype.Play_Game = function() {
	console.log("play_game");
	var end = this.Check_End_Game();
	console.log("player " + this.curPlayer.toString() + "'s turn");
	this.turn_summary = "";
	this.Get_Spin();
};

Game.prototype.Start_Turn = function() {
	//Render Spinner, get spinner value
	console.log("start_turn");
	$('#spinModal').modal('hide');
	p = this.players[this.curPlayer];
	for(q in this.players){
		if (p != q){
			if (this.spin == q.pay_square){
				p.updateBankroll(-20000);
				q.updateBankroll(20000);
				temp = "Player " + p.name + " paid Player " + q.name + " $20000\n";
				// alert(temp); 
			}
		}
	}

	if (this.moves[this.curPlayer].data.length == 0){
		this.Play_Turn();
	} else {
		this.moves[this.curPlayer].run();
	}
};

Game.prototype.Determine_Route = function(){
	console.log("determining route...");
	this.moves[this.curPlayer].data = [];
	var points = [];
	var p = this.players[this.curPlayer];
	for (var i=0; i<=this.spin; i++){
		//specials
		if (p.position == -1){
			return;
		}
		if (p.position == 0 && this.spin == 0){
			points.push(p.position);
			points.push(p.position);
			return;
		}
		if (p.position == 11 && this.spin == 0){
			points.push(p.position);
			points.push(p.position);
			return;
		}
		if (p.position == 10){
			for (var j=0; j<=this.spin; j++){
				points.push(p.position+3+j);
			}
			this.moves[this.curPlayer].data = points;
			return;
		}
		if (p.position+i == 10) {
			points.push(p.position+i);
			this.moves[this.curPlayer].data = points;
			return;
		}
		if (p.position == 25){
			for (var x=0; x<=this.spin; x++){
				points.push(p.position+x);
			}
			this.moves[this.curPlayer].data = points;
			return;
		}
		if (p.position+i == 25){
			points.push(p.position+i);
			this.moves[this.curPlayer].data = points;
			return;
		}
		if (p.position == 36 && p.family == null){
			this.Prompt_Family_Road();
			return;
		}
		if (p.position == 36){
			for (var x=0; x<=this.spin; x++){
				points.push(p.position+x);
			}
			this.moves[this.curPlayer].data = points;
			return;
		}
		if (p.position+i == 36){
			points.push(p.position+i);
			this.moves[this.curPlayer].data = points;
			return;
		}
		if (p.position == 45){
			for (var k=1; k<=this.spin; k++){
				points.push(p.position+4+k);
			}
			this.moves[this.curPlayer].data = points;
			return;
		}
		if (p.position+i == 45){
			points.push(p.position+i);
			for (var l=i; l<this.spin; l++){
				points.push(p.position+5+l);
			}
			this.moves[this.curPlayer].data = points;
			return;
		}
		if (p.position == 73 && p.risky == null){
			this.Prompt_Risky_Road();
			return;
		}
		if (p.position+i == 73){
			points.push(p.position+i);
			this.moves[this.curPlayer].data = points;
			return;
		}
		if (p.position == 77){
			for (var m=1; m<this.spin; m++){
				points.push(p.position+4+m);
			}
			this.moves[this.curPlayer].data = points;
			return;
		}
		if (p.position+i == 77){
			points.push(p.position+i);
			for (var n=i; n<this.spin; n++){
				points.push(p.position+5+n);
			}
			this.moves[this.curPlayer].data = points;
			return;
		}
		if (p.position+i == 89){
			points.push(p.position+i);
			this.moves[this.curPlayer].data = points;
			return;
		}

		//default
		points.push(p.position+i);
	}
	this.moves[this.curPlayer].data = points;
}

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

Game.prototype.Prompt_Career = function(player) {
	//Creates Dialog Box with generate and select buttons
	//Connect Generate with Generate_Regular_Career
	//Connect Select with choose_career_script(selectedVal)
	$('#left_career_button').prop('disabled', true);
	$('#right_career_button').prop('disabled', true);
	$('#left_career_img').prop('disabled', true);
	$('#right_career_img').prop('disabled', true);
	$('#chooseCareerModal').modal('show');
};

Game.prototype.Prompt_Risky_Road = function(p){
	$('#riskyModal').modal('show');
};

Game.prototype.Prompt_Family_Road = function(p){
	$('#familyModal').modal('show');
};

Game.prototype.Choose_Risky_Road = function(response){
	p = this_game.players[this_game.curPlayer];
	if(response){
		console.log("risky route");
		p.risky = true;
		p.position = 74;
	} else { 
		console.log("pussy ass route");
		p.risky = false;
		p.position = 78;
	}

	$('#riskyModal').modal('hide');
	this.Determine_Route();
	this.Start_Turn();
};

Game.prototype.Choose_Family_Road = function(response){
	p = this_game.players[this_game.curPlayer];
	if(response){
		console.log("chooses family");
		p.family = true;
		if (p.married == false){
			p.married = true;
			p.position = 37;
		} else {
			p.position = 37;
		}
	} else{
		console.log("chooses life of solitude");
		p.family = false;
		p.position = 46;
	}

	$('#familyModal').modal('hide');
	this.Determine_Route();
	this.Start_Turn();
};

Game.prototype.Prompt_House = function(player) {
	//Creates Dialog Box with generate and select buttons
	//Connect Generate button with Generate_House_Options
	//Connect Select with choose_house_script(selectedVal)
	$('#chooseHouseModal').modal('show');
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
		var career = document.getElementById('left_career_title').textContent;
		for (i=0; i<this_game.careers.length; i++){
			if (career == this_game.careers[i].title){
				p.career = this_game.careers[i];
				p.salary = this_game.careers[i].salary;
			}
		}
	} else {
		var career = document.getElementById('right_career_title').textContent;
		for (i=0; i<this_game.careers.length; i++){
			if (career == this_game.careers[i].title){
				p.career = this_game.careers[i];
				p.salary = this_game.careers[i].salary;
			}
		}
	}
	$('#chooseCareerModal').modal('hide');

	var button = document.getElementById('generate_career');
	button.style.visibility = "visible";

	var lTitle= document.getElementById('left_career_title');
	lTitle.textContent = "";
	var lSalary= document.getElementById('left_career_salary');
	lSalary.textContent = "";

	var rTitle= document.getElementById('right_career_title');
	rTitle.textContent = "";
	var rSalary= document.getElementById('right_career_salary');
	rSalary.textContent = "";

	var lImage= document.getElementById('left_career_img').src = "../static/images/question_orange.png";
	var rImage= document.getElementById('right_career_img').src = "../static/images/question_orange.png";


	// alert("player " + p.name + " has chosen career: " + p.career.title);
	this.Determine_Route();
	this.Start_Turn();
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

	// alert("player " + p.name + " has chosen house " + p.house.title + " for a cost of $" + p.house.cost.toString());
	this.Determine_Route();
	this.Start_Turn();
};
Game.prototype.Generate_Regular_Career = function() {
	//Render Spinner, get spinner value
	$('#left_career_button').prop('disabled', false);
	$('#right_career_button').prop('disabled', false);
	$('#left_career_img').prop('disabled', false);
	$('#right_career_img').prop('disabled', false);
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
		if((career_two in this.taken_career) || (career_one == career_two))
			career_two = Math.floor((Math.random() * 8) + 8);
		else
			c_two_taken = true;
	}

	var button = document.getElementById('generate_career');
	button.style.visibility = "hidden";

	///Set up left career in prompt
	var lTitle= document.getElementById('left_career_title');
	lTitle.textContent = this.careers[career_one].title;
	var lSalary= document.getElementById('left_career_salary');
	lSalary.textContent = "Salary: $" + this.careers[career_one].salary;
	var lImage= document.getElementById('left_career_img').src = this.careers[career_one].img_path;
	///Set up right career in prompt
	var rTitle= document.getElementById('right_career_title');
	rTitle.textContent = this.careers[career_two].title;
	var rSalary= document.getElementById('right_career_salary');
	rSalary.textContent = "Salary: $" + this.careers[career_two].salary;
	var rImage= document.getElementById('right_career_img').src = this.careers[career_two].img_path;
					
};
Game.prototype.Generate_College_Career = function() {
	//Render Spinner, get spinner value
	$('#left_career_button').prop('disabled', false);
	$('#right_career_button').prop('disabled', false);
	$('#left_career_img').prop('disabled', false);
	$('#right_career_img').prop('disabled', false);
	var temp = "end of college fork\n";
	console.log(this.careers);
	this.turn_summary = this.turn_summary + temp;
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

	var button = document.getElementById('generate_career');
	button.style.visibility = "hidden";

	var lTitle= document.getElementById('left_career_title');
	lTitle.textContent = this.careers[ccareer_one].title;
	var lSalary= document.getElementById('left_career_salary');
	lSalary.textContent = "Salary: $" + this.careers[ccareer_one].salary;
	var lImage= document.getElementById('left_career_img').src = this.careers[ccareer_one].img_path;

	var rTitle= document.getElementById('right_career_title');
	rTitle.textContent = this.careers[ccareer_two].title;
	var rSalary= document.getElementById('right_career_salary');
	rSalary.textContent = "Salary: $" + this.careers[ccareer_two].salary;
	var rImage= document.getElementById('right_career_img').src = this.careers[ccareer_two].img_path;

};
Game.prototype.College_Prompt = function(p) {
	$('#collegeModal').modal('show');
};
Game.prototype.Get_Spin = function() {
	p = this.players[this.curPlayer];
	document.getElementById('cur_player_spin').innerHTML = "Player " + this.curPlayer + "'s turn!";
	$('#start_turn_button').prop('disabled', true);
	$('#spinner-button').prop('disabled', false);
	$('#spinModal').modal('show');
};
Game.prototype.Choose_College_Road = function(response){
	p = this_game.players[this_game.curPlayer];
	if(response){
		var temp = "player " + p.name + " is going to college\n"
		this.turn_summary = this.turn_summary + temp;
		p.updateBankroll(-125000);
		temp = "player " + p.name + " had to pay $125000 to go to college\n"
		p.college = true;
		p.position = 0;
		this.spin--;
		this.turn_summary = this.turn_summary + temp;
		this.Determine_Route();
		this.Start_Turn();
	} else {
		var temp =  "player " + p.name + " is starting career\n";
		this.turn_summary = this.turn_summary + temp;
		p.college = false;
		p.position = 11;
		this.spin--;
		this_game.Prompt_Career(p);
	}
};
Game.prototype.Play_Turn =function() {
	console.log("play_turn");
	p = this.players[this.curPlayer];
	roll = this.spin;
	// var temp = "starting player " + p.name + "'s turn with a spin of " + roll.toString() + "\n";
	// this.turn_summary = this.turn_summary + temp;
	if (p.done == false){
		var cur_position = p.position;

		temp = "player " + p.name + " starting from position " + cur_position.toString() + "\n";
		this.turn_summary = this.turn_summary + temp;
		while (roll > 0){
			//College Path
			if(cur_position == -1){ //Start of Game, college or not college
				if (p.college == null){
					if(p.expelled == false){
						this.spin = roll;
						this.College_Prompt(p);
						return;
					} else {
						this.spin = roll;
						p.position = 11;
						cur_position = 11;
						this.Prompt_Career(p);
					}
				} else if (p.college == true){
					cur_position = 0;
					// roll--;
					continue;
				} else if (p.college == false){
					cur_position = 11;
					// roll--;
					continue;
				}
			}	
			else if(cur_position == 10){
				temp = "end of college fork\n";
				this.turn_summary = this.turn_summary + temp;
				this.spin = roll;
				p.position = 13;
				cur_position = 13;
				this.Prompt_Career(p);
				return;
			}
			//Family Road
			else if(cur_position == 36){
				//var family = Math.floor((Math.random() * 2));
				p.position = cur_position;
				this.spin = roll;
				this.Prompt_Family_Road(p);
				return;
			}
			else if(cur_position == 45){
				temp =  "end of family fork\n";
				this.turn_summary = this.turn_summary + temp;
				p.position = 50;
				cur_position = 50;
			}
			//Risky Road
			else if(cur_position == 73){
				//risky = Math.floor((Math.random() * 2));
				p.position = cur_position;
				this.spin = roll;
				this.Prompt_Risky_Road(p);
				return;
			}
			else if(cur_position == 77){
				temp = "end of risky fork\n";
				this.turn_summary = this.turn_summary + temp;
				p.position = 82;
				cur_position = 82;
			}
			//Retirement
			else if(cur_position == 89){
				temp = "player " + p.name + " has retired\n";
				this.turn_summary = this.turn_summary + temp;
				roll = 0;
				this.spin = 0;
				this.end_of_game = this.end_of_game + 1;
				p.end_game(p.house.sell_price);
				temp = "after selling your house and your kid(s), player " + p.name + " has a grand total of:";
				document.getElementById("congrats_intro").innerHTML = temp;
				var amount = p.bankroll;
				document.getElementById("end_game_amount").innerHTML = amount;
				$('#end_game_modal').modal('show');
				return;

			}
			//Guarenteed Marriage
			else if((cur_position == 25) && (p.house == null)){
				p.marriage();
				temp = "player " + p.name + " has just married an English Major\n";
				this.turn_summary = this.turn_summary + temp;
				p.position = cur_position;
				this.spin = roll;
				this.Prompt_House();
				return;
			}
			//Guaranteed random number of children
			else if(cur_position == 45){
				var num_children = random_child();
				temp = "player " + p.name + " just had " + num_children.toString() + " children\n";
				this.turn_summary = this.turn_summary + temp;
				p.add_children(num_children);
			}
			else //End of conditionals
				cur_position = cur_position + 1;
				p.position = cur_position;

			roll = roll - 1;

			// if (roll != 0){
			// 	p.position = cur_position;
			// }
			

			//check if the space is a payday

			if(this.board.paydays.indexOf(cur_position) >= 0){
				//need to have salary
				p.updateBankroll((p.salary*1));
				temp = "player " + p.name + " got paid and now has " + p.bankroll.toString() + " dollars\n";
				this.turn_summary = this.turn_summary + temp;
			}
		this.spin = 0;
		}///END OF WHILE LOOP FOR ROLL > 0
		

		console.log(this.turn_summary);
		this.End_Turn(p, p.position);
	} else {
		temp = "player is already retired\n";
		this.turn_summary = this.turn_summary + temp;
	}
};
Game.prototype.End_Turn = function(p, cur_position){
	// Non special spaces
	var temp = "";

	var tile_amount = this.board.tiles[cur_position].value;
	var str = "";
	var image = document.getElementById('end_turn_image');

	// Random number of children
	if (cur_position == 4 || cur_position == 26){
		var num_children = this.random_child();
		temp = "player " + p.name + " just had " + num_children.toString() + " children\n";
		console.log(temp);
		p.add_children(num_children);
		image.src = "../static/images/tiles/random_kids_icon.png";
		str += "You just had " + num_children.toString() + " children.";
		// Dropout
		if (cur_position == 4){
			p.expel();
			temp = "player " + p.name + " dropped out of school to take care of their child\n";
			this.turn_summary = this.turn_summary + temp;
			str += "Time to drop out of school and buy a house...";
		}
	}

	// Child
	if (cur_position == 38 || cur_position == 43){
		p.add_children(1);
		temp = "player " + p.name + " has had a child\n";
		this.turn_summary = this.turn_summary + temp;
		image.src = "../static/images/tiles/one_child_icon.png";
		str += "You just had a baby!";
	}

	// Twins
	if (cur_position == 39 || cur_position == 44){
		p.add_children(2);
		temp = "player " + p.name + " has had twins\n";
		this.turn_summary = this.turn_summary + temp;
		image.src = "../static/images/tiles/twin_icon.png";
		str += "You just had twins!";
	}

	// Triplets
	if (cur_position == 42){
		p.add_children(3);
		temp = "player " + p.name + " has had triplets\n";
		this.turn_summary = this.turn_summary + temp;
		image.src = "../static/images/tiles/triplets_icon.png";
		str += "You just had triplets!";
	}

	// Player set upon by loan sharks
	if (cur_position == 18 || cur_position == 34 || cur_position == 66){
		if (p.loan_counter > 0){
			p.loan_counter = 1;
			temp = "The loan sharks have come collecting! Player " + p.name + " has to pay off their loans this turn!\n";
			this.turn_summary = this.turn_summary + temp;
		}
		image.src = "../static/images/tiles/loanshark_icon.png";
		str += "You just got ambushed by loan sharks! You have to pay off your loans this turn!";
	}

	// Player gets a divorce
	if (cur_position == 52 || cur_position == 28 || cur_position == 60){
		p.divorce();
		temp = "Player " + p.name + " got caught cheating and got a divorce\n";
		this.turn_summary = this.turn_summary + temp;
		image.src = "../static/images/tiles/divorce_icon.png";
		str += "You got caught cheating and got a divorce..";
	}

	// Player gets remarried
	if (cur_position == 56){
		p.marriage();
		temp = "Player " + p.name + " got remarried\n";
		this.turn_summary = this.turn_summary + temp;
		image.src = "../static/images/tiles/marriage_icon.png";
		str += "You just got remarried! And had to pay $25,000 for the ceremony...";
	}

	// Player is expelled
	if (cur_position == 7){
		p.expel();
		temp = "Player " + p.name + " was expelled\n";
		this.turn_summary = this.turn_summary + temp;
		image.src = "../static/images/bad_icon.png";
		str += "What a waste of investment... have to settle for a non-college career now!";
	}

	// Player pays money for children, gets money from spouse
	if (cur_position <= 73){
		temp = "player " + p.name + " has $" + p.bankroll.toString();
		this.turn_summary = this.turn_summary + temp + "\n";
		p.children_spouse();
		temp = "player " + p.name + " had to pay for "  + p.children.toString() + " children in child support\n";
		this.turn_summary = this.turn_summary + temp;
		if (p.married == true){
			temp = "player " + p.name + " got money from their spouse. Now has $" + p.bankroll.toString() + "\n";
			this.turn_summary = this.turn_summary + temp;
		}
	}

	// Update loan_counter
	if (p.loan_counter > 0){
		p.loan_counter = p.loan_counter - 1;
		temp = "player " + p.name + " has to pay off their loan in " + p.loan_counter.toString() + " turns\n";
		this.turn_summary = this.turn_summary + temp;
	}

	// Player pays off loans
	if (p.loan_counter == 0){
		var loan_cost = 175000*p.num_loans;
		p.updateBankroll(loan_cost*-1);
		p.num_loans = 0;
		p.loan_counter = -1;
		temp = "player " + p.name + " had to pay off their loan for $" + loan_cost.toString() + ". player " + p.name + " now has $" + p.bankroll.toString() + "\n";
		this.turn_summary = this.turn_summary + temp;
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
		temp = "player " + p.name + " now has " + p.num_loans.toString() + " for a total of $" + amount.toString() + ". They will need to pay $" + back.toString() + " back in " + p.loan_counter.toString() + " turns\n";
		this.turn_summary = this.turn_summary + temp;
	}

	p.position = cur_position;
	///END OF WHILE LOOP FOR ROLL > 0
	temp = "player ends turn on space " + p.position.toString() + " and has $" + p.bankroll.toString() + "\n";
	console.log(temp);

	if (p.done == true && p.bankroll > 1000000){
		temp = "player " + p.name + " has moved to the Caymans\n";
		this.turn_summary = this.turn_summary + temp;
	}

	this.curPlayer++;
	this.curPlayer = this.curPlayer%1;

	var tileTitle = document.getElementById('Tile_Label');
	tileTitle.textContent = this.board.tiles[cur_position].title;

	var i = this.board.special.indexOf(cur_position);

	var paydays = this.board.paydays.indexOf(cur_position);
	if(paydays != -1){
		image.src = "../static/images/good_icon.png";
		str += "Hey! You just made $" + p.salary*1 + "!";
	}
	if(i == -1){
		if(cur_position == 25 || cur_position == 37){
			image.src = "../static/images/tiles/marriage_icon.png";
			str+= "Congrats! ALSO - you had to drop $25,000 on the ceremony... Hope thats ok.";
		} else {
			if (tile_amount >= 0){
				image.src = "../static/images/good_icon.png";
				str += "Collect $" + tile_amount + "!";
			} else {
				image.src = "../static/images/bad_icon.png";
				str += "Pay $" + tile_amount + "!";
			}
		}
	}
	var tileValue= document.getElementById('Tile_Value');
	tileValue.textContent = str;

	$('#tileModal').modal('show');
	p.updateBankroll((this.board.tiles[cur_position].value)/1);
};
Game.prototype.Finish_Turn = function(){

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


