from player import *
from static import *
import random

def random_child():
	children = random.randint(0,20)
	if children >= 0 and children < 12:
		return 1
	elif children >= 12 and children < 17:
		return 2
	elif children >= 17 and children < 20:
		return 3
	else:
		return 8

