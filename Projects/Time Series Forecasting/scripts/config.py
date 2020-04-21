# Global configuration
access_token = 'YOUR GITHUB ACCESS TOKEN'
FUTURE = 30				# number of future days from today to forecast > 0
PAST   = 15				# number of past days from today to forecast
DATA = '../data'		# path to directory to output dataset
FIGURES = '../figures'	# path to directory to output figures
XDATE = 'Date (2020)'	# label for x-axis
WINDOW = 7				# window size to calculate rolling mean and standard deviation
COLS = ['confirmed', 'deaths', 'recovered', 'active']	# the parameters of interest
cm = {'confirmed': 'orange', 'recovered': 'green', 'deaths': 'red', 'active': 'cyan'}	# color used for each parameter of interest