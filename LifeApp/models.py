from flask.ext.sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()

class User(db.Model):

    __tablename__ = 'User'
    username = db.Column(db.String(20), primary_key=True)
    password = db.Column(db.String(20))
    
    def __init__(self, username, password):
        self.username = username
        self.password = password

    def __repr__(self):
        return 'Username:' + self.username

class Game(db.Model):

    __tablename__ = 'Game'
    game_id = db.Column(db.Integer, primary_key=True)

    def __init__(self, game_id):
        self.game_id = game_id

    def __repr__(self):
        return 'Game:' + str(self.game_id)

class Player(db.Model):

    __tablename__ = 'Player'
    username = db.Column(db.String(20), db.ForeignKey('User.username'), primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('Game.game_id'), primary_key=True)
    position = db.Column(db.Integer)
    bankroll = db.Column(db.Integer)
    career_id = db.Column(db.Integer)
    house_id = db.Column(db.Integer)
    married = db.Column(db.String(3))
    num_children = db.Column(db.Integer)
    
    def __init__(self, username, game_id, position, bankroll, career_id, house_id, married, num_children):
        self.username = username
        self.game_id = game_id
        self.position = position
        self.bankroll = bankroll
        self.career_id = career_id
        self.house_id = house_id
        self.married = married
        self.num_children = num_children

    def __repr__(self):
        return 'Username:' + self.username + ' Game:' + str(self.game_id)

class Careers(db.Model):

    __tablename__ = 'Careers'
    career_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(25))
    salary = db.Column(db.Integer)
    img_path = db.Column(db.String(30))

    def __init__(self, career_id, title, salary, img_path):
        self.career_id = career_id
        self.title = title
        self.salary = salary
        self.img_path = img_path

    def __repr__(self):
        return 'Career:' + str(self.career_id)

class Houses(db.Model):

    __tablename__ = 'Houses'
    house_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(25))
    cost = db.Column(db.Integer)
    sell_price = db.Column(db.Integer)
    
    def __init__(self, house_id, title, cost, sell_price):
        self.house_id = house_id
        self.title = title
        self.cost = cost
        self.sell_price = sell_price

    def __repr__(self):
        return 'House:' + str(self.house_id)

class Tiles(db.Model):

    __tablename__ = 'Tiles'
    tile_id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(25))
    amount = db.Column(db.Integer)
    username = db.Column(db.String(20), db.ForeignKey('User.username'))

    def __init__(self, tile_id, label, amount, username):
        self.tile_id = tile_id
        self.label = label
        self.amount = amount
        self.username = username

    def __repr__(self):
        return 'Tile:' + str(self.tile_id)