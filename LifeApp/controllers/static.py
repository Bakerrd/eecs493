class Tile:

	def __init__(self, title):
		self.title = title

class Board:
	tiles = []
	paydays = [12, 21, 31, 40, 48, 54, 64, 70, 76, 79]

	def __init__(self):
		for i in range(0,90):
			title = "tile " + str(i)
			new_tile = Tile(title)
			self.tiles.append(new_tile)

# class Careers:
# 	def __init__(self, title, salary):
# 		self.title = title
# 		self.salary = salary
# 		self.taken = False

class CollegeCareers:
	def __init__(self, title, salary):
		self.title = title
		self.salary = salary
		self.taken = False

class Homes:
	def __init__(self, title, cost, sellcost):
		self.title = title
		self.cost = cost
		self.sellcost = sellcost