# Global configuration
access_token = 'YOUR GITHUB ACCESS TOKEN'
FUTURE = 0				# number of future days to forecast
PAST   = 0				# forecast from (today - past)th day
DATA = '../data'		# path to output dataset
FIGURES = '../figures'	# path to output figures
XDATE = 'Date (2020)'	# label for x-axis
WINDOW = 7				# window size to calculate rolling mean and standard deviation
COLS = ['confirmed', 'deaths', 'recovered', 'active']	# the parameters of interest
cm = {'confirmed': 'orange', 'recovered': 'green', 'deaths': 'red', 'active': 'cyan'}	# color used for each parameter of interest