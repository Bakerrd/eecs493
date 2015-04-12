class Tile:

	def __init__(self, title, value):
		self.title = title
		self.value = value

class Board:
	tiles = []
	paydays = [12, 21, 31, 40, 48, 54, 64, 70, 76, 79]
	special = [4,7,12,18,21,25,26,28,31,34,37,38,39,40,42,43,44,45,48,52,54,56,60,64,66,70,76,79]

	def __init__(self):
		for i in range(0,90):
			title = "tile " + str(i)
			new_tile = Tile(title, 10000)
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