DROP DATABASE if EXISTS Life;
CREATE DATABASE Life;

USE Life;

CREATE TABLE User (
	username VARCHAR(20) NOT NULL,
	password VARCHAR(20) NOT NULL,
	PRIMARY KEY (username)
);

CREATE TABLE Game (
	game_id INTEGER NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (game_id)
);

CREATE TABLE Player (
	username VARCHAR(20) NOT NULL,
	game_id INTEGER NOT NULL,
	position INTEGER NOT NULL,
	bankroll INTEGER NOT NULL,
	career_id INTEGER,
	house_id INTEGER,
	married ENUM('yes', 'no') NOT NULL,
	num_children INTEGER,
	PRIMARY KEY (username, game_id),
	FOREIGN KEY (username) REFERENCES User(username),
	FOREIGN KEY (game_id) REFERENCES Game(game_id)
);

CREATE TABLE Careers (
	career_id INTEGER NOT NULL,
	title VARCHAR(25) NOT NULL,
	salary INTEGER NOT NULL,
	img_path VARCHAR(60) NOT NULL,
	PRIMARY KEY (career_id)
);

CREATE TABLE Houses (
	house_id INTEGER NOT NULL,
	title VARCHAR(25) NOT NULL,
	cost INTEGER NOT NULL,
	sell_price INTEGER NOT NULL,
	img_path VARCHAR(60) NOT NULL,
	PRIMARY KEY (house_id)
);

CREATE TABLE Tiles (
	tile_id INTEGER NOT NULL,
	title VARCHAR(100) NOT NULL,
	value INTEGER NOT NULL,
	x_val INTEGER NOT NULL,
	y_val INTEGER NOT NULL,
	PRIMARY KEY (tile_id)
);
