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
