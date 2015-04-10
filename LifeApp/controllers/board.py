from tile import *

class Board:
	tiles = []
	paydays = [12, 21, 31, 40, 48, 54, 64, 70, 76, 79]

	def __init__(self):
		for i in range(0,90):
			title = "tile " + str(i)
			new_tile = Tile(title)
			self.tiles.append(new_tile)


