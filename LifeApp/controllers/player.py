class AIPlayer:

	def __init__(self, name):
		self.done = False
		self.bankroll = 10000
		self.position = -1
		self.name = name
		self.career = None
		self.married = False
		self.children = 0
		self.loan_counter = -1
		self.expelled = False
		self.num_loans = 0
		self.house = -1

	def add_children(self, val):
		self.children = self.children + val

	def expel(self):
		self.expelled = True
		self.position = -1

	def children_spouse(self):
		child_support = self.children * 10000
		self.bankroll = self.bankroll - child_support
		if self.married == True:
			self.bankroll = self.bankroll + 20000

	def end_game(self,val):
		self.bankroll = self.bankroll + val
		if self.loan_counter > 0:
			self.loan_counter = 1
		child_money = self.children*50000
		self.bankroll = self.bankroll + child_money
		self.done = True

	def marriage(self):
		self.married = True

	def divorce(self):
		self.married = False

	def get_loans(self):
		counter = 0
		while self.bankroll < 0:
			self.bankroll = self.bankroll + 150000
			self.num_loans = self.num_loans + 1
			if self.loan_counter > 0:
				if counter > 0:
					turns = 1
				else: 
					turns = 2
				self.loan_counter = self.loan_counter + turns
			else:
				self.loan_counter = 2
			counter = counter + 1




