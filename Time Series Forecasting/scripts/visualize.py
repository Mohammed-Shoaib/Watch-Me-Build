import os
import numpy as np
import pandas as pd

from utils import *
from config import *
import matplotlib.pylab as plt
from matplotlib.dates import DateFormatter
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf



# global settings for matplotlib
plt.rcParams['lines.markersize'] = 5
plt.rcParams['lines.linewidth'] = 2.5
plt.rcParams['axes.facecolor'] = 'floralwhite'
plt.rcParams.update({'font.size': 12})



def plot_graph(file_name: str, col: str="", show: bool=False) -> None:
	"""
	Formats the plot, saves (and optionally displays) it in a nice format.
	
	Arguments:
		file_name {str} -- the file name of the plot to be saved
	
	Keyword Arguments:
		col {str} -- the parameter of interest (default: {""})
		show {bool} -- display the plot on the screen (default: {False})
	"""
	plt.grid()

	manager = plt.get_current_fig_manager()
	manager.window.showMaximized()
	
	fig = plt.gcf()
	fig.set_size_inches(11, 8.5)	# standard A4 sheet size
	
	if col:
		file_name = f"{col}/" + file_name + f"-{col}"
	path = os.path.join(FIGURES, file_name + ".png")

	plt.savefig(path, dpi=500)
	if show:
		plt.show()
	
	plt.close()



def plot_param(file_name: str, col: str="", title: str="", xlabel: str="", ylabel: str="", show: bool=False) -> None:
	"""
	Adds specified parameters to the plot and calls plot_graph.
	
	Arguments:
		file_name {str} -- the file name of the plot to be saved
	
	Keyword Arguments:
		col {str} -- the parameter of interest (default: {""})
		title {str} -- title of the plot (default: {""})
		xlabel {str} -- x-axis label of the plot (default: {""})
		ylabel {str} -- y-axis label of the plot (default: {""})
		show {bool} -- display the plot on the screen (default: {False})
	"""
	plt.title(title)
	plt.xlabel(xlabel)
	plt.ylabel(ylabel)

	if xlabel == XDATE:
		ax = plt.gca()
		ax.xaxis.set_major_formatter(DateFormatter('%b-%d'))	# use month-day format
	
	plot_graph(file_name=file_name, col=col, show=show)



def plot_rolling(df: pd.DataFrame, col: str, path_pre: str="", title_pre: str="") -> None:
	"""
	Plots the results of rolling mean and standard deviation.
	
	Arguments:
		df {pd.DataFrame} -- DataFrame in narrow format with each column denoting a parameter of interest
		col {str} -- the parameter of interest
	
	Keyword Arguments:
		path_pre {str} -- prepends the path (default: {""})
		title_pre {str} -- prepends the title (default: {""})
	"""
	# rolling mean and standard deviation
	mean = df.rolling(window=WINDOW).mean()
	std = df.rolling(window=WINDOW).std()

	# clear any previous current figure
	plt.gcf().clear()
	plt.legend([col, 'rolling mean', 'rolling std'])

	# line plot
	plt.plot(df, color=cm[col])
	plt.plot(mean, color="fuchsia")
	plt.plot(std, color="salmon")

	# scatter plot
	plt.scatter(df.index, df.values, color=cm[col])
	plt.scatter(mean.index, mean.values, color="fuchsia")
	plt.scatter(std.index, std.values, color="salmon")

	if path_pre:
		path_pre += '-'
	if title_pre:
		title_pre += ' '

	plot_param(file_name=f'{path_pre}rolling-mean-and-std', col=col,
				title=f'{title_pre}Rolling Mean and Standard Deviation for {col}', 
				xlabel=XDATE)



def plot_seasonal(df_log: pd.DataFrame, col:str) -> pd.DataFrame:
	"""
	Creates a DataFrame and plots the results of using seasonal decomposition.
	
	Arguments:
		df_log {pd.DataFrame} -- natural logarithm of the DataFrame in narrow format with each column denoting a parameter of interest
		col {str} -- the parameter of interest
	
	Returns:
		pd.DataFrame -- the DataFrame obtained using seasonal decomposition
	"""
	# seasonal decomposition
	decomposition = seasonal_decompose(df_log)
	trend = decomposition.trend
	seasonal = decomposition.seasonal
	residual = decomposition.resid
	df_dec = residual.dropna()

	# clear any previous current figure
	plt.gcf().clear()

	# plot results of seasonal decomposition
	plt.subplot(411)
	plt.title('Seasonal Decomposition')
	plt.plot(df_log, label=col)
	plt.legend(loc='best')
	plt.gca().xaxis.set_major_formatter(DateFormatter('%b-%d'))
	plt.subplot(412)
	plt.plot(trend, label='Trend')
	plt.legend(loc='best')
	plt.gca().xaxis.set_major_formatter(DateFormatter('%b-%d'))
	plt.subplot(413)
	plt.plot(seasonal, label='Seasonality')
	plt.legend(loc='best')
	plt.gca().xaxis.set_major_formatter(DateFormatter('%b-%d'))
	plt.subplot(414)
	plt.plot(residual, label='Residual')
	plt.legend(loc='best')
	plt.gca().xaxis.set_major_formatter(DateFormatter('%b-%d'))
	plt.tight_layout()
	plt.xlabel(XDATE)
	plot_graph(file_name='seasonal', col=col)

	return df_dec



def plot_autocorrelation(df: pd.DataFrame, col: str) -> None:
	"""
	Plots the results of using PACF & ACF tests on the DataFrame.
	
	Arguments:
		df {pd.DataFrame} -- DataFrame in narrow format with each column denoting a parameter of interest
		col {str} -- the parameter of interest
	"""
	# clear any previous current figure
	plt.gcf().clear()

	# create figure of PACF and ACF on one plot
	fig, (ax1, ax2) = plt.subplots(1, 2)
	
	# plot PACF
	plot_pacf(df, ax=ax1, title='Partial Autocorrelation Function')
	ax1.set(xlabel='Lag', ylabel='Partial ACF')

	# plot ACF
	plot_acf(df, ax=ax2, title='Autocorrelation Function')
	ax2.set(xlabel='Lag', ylabel='ACF')

	# format subplots
	fig.subplots_adjust(wspace=0, hspace=0)
	plt.subplots_adjust(wspace=0, hspace=0)
	plt.tight_layout(pad=0, w_pad=0, h_pad=0)
	plot_graph(file_name='autocorrelation', col=col)



def dickey_fuller(df: pd.DataFrame) -> None:
	"""
	Prints results of the dickey-fuller test on the parameter of interest.
	
	Arguments:
		df {pd.DataFrame} -- DataFrame of values for the parameter of interest
	"""
	df_test = adfuller(df, autolag='AIC')
	
	df_out = pd.Series(df_test[0:4], index=['Test Statistic', 'p-value', 'Number of lags used', 'Number of observations used'])
	for k, v in df_test[4].items():
		df_out[f'Critical Value ({k})'] = v
	
	print('Results of Dickey-Fuller Test:')
	print(df_out)
	print()



def get_stationary(df: pd.DataFrame, col: str) -> pd.DataFrame:
	"""
	Creates a stationary DataFrame from the original by using second-order differencing.
	Also, prints the results using each method for converting the dataset to stationary.
	
	Arguments:
		df {pd.DataFrame} -- original DataFrame with rows as dates and columns as each parameter of interest
		col {str} -- parameter of interest
	
	Returns:
		pd.DataFrame -- stationary DataFrame obtained using second-order differencing
	"""
	df_log = np.log(df)		# natural logarithm of exponential curve gives a straight line

	mean = df_log.rolling(window=WINDOW).mean()
	std = df_log.rolling(window=WINDOW).std()

	# moving average
	df_ma = df_log - mean
	df_ma.dropna(inplace=True)

	# exponential decay weight average
	df_ed = df_log - df_log.ewm(halflife=12, min_periods=0, adjust=True).mean()
	df_ed.dropna(inplace=True)

	# seasonal decomposition
	df_dec = plot_seasonal(df_log, col)

	# log shift
	df_diff_1 = df_log.diff().dropna(axis=0)
	df_diff_2 = df_diff_1.diff().dropna(axis=0)

	# print results using each method
	print('Test results on original dataset:')
	plot_rolling(df, col, 'original', 'Original Dataset')
	dickey_fuller(df[col])

	print('Test results on natural logarithm:')
	plot_rolling(df_log, col, 'logarithm', 'Natural Logarithm')
	dickey_fuller(df_log[col])

	print('Test results on simple moving average:')
	plot_rolling(df_ma, col, 'simple-average', 'Simple Moving Average')
	dickey_fuller(df_ma[col])

	print('Test results on exponential decay:')
	plot_rolling(df_ed, col, 'exponential-decay', 'Exponential Decay')
	dickey_fuller(df_ed[col])

	print('Test results on seasonal decomposition:')
	plot_rolling(df_dec, col, 'seasonal-decomposition', 'Seasonal Decomposition')
	dickey_fuller(df_dec[col])
	
	print('Test results on first-order differencing:')
	plot_rolling(df_diff_1, col, 'first-order-differencing', 'First-Order Differencing')
	dickey_fuller(df_diff_1[col])

	print('Test results on second-order differencing:')		# works best!
	plot_rolling(df_diff_2, col, 'second-order-differencing', 'Second-Order Differencing')
	dickey_fuller(df_diff_2[col])

	return df_diff_2



def plot_daily_change(df: pd.DataFrame, col:str) -> None:
	"""
	Plots the daily change given by ΔD = D(i) - D(i - 1) i.e., the change from the previous day.
	
	Arguments:
		df {pd.DataFrame} -- DataFrame in narrow format with each column denoting a parameter of interest
		col {str} -- the parameter of interest
	"""
	# compute the daily change
	xs = [pd.to_datetime(d).date() for d in df['date'].values[1:]]
	ys = []
	for i in range(len(xs)):
		prev = df.iloc[i, df.columns.get_loc(col)]
		next = df.iloc[i + 1, df.columns.get_loc(col)]
		ys.append(next - prev)
	
	# clear any previous current figure
	plt.gcf().clear()

	# plot the daily change
	plt.bar(xs, ys, color=cm[col])
	plt.legend([col])
	plot_param(file_name='daily-change', col=col,
				title='Daily Change of COVID-19',
				xlabel=XDATE, ylabel='Daily Change')



def plot_daily_cases(df: pd.DataFrame, col: str="") -> None:
	"""
	Plots the daily number of cases for all or a given parameter of interest in one figure.
	
	Arguments:
		df {pd.DataFrame} -- DataFrame in narrow format with each column denoting a parameter of interest
	
	Keyword Arguments:
		col {str} -- the parameter of interest (default: {""})
	"""
	title = 'Daily Cases of COVID-19'

	# plot a parameter vs. all parameters
	if col:
		columns = [col]
		df = df[df[col] != 0]
		title += f' for {col}'
	else:
		columns = COLS
		df = df.loc[df[df.columns.difference(['date'])].sum(axis=1) != 0]	# drop rows where all columns except for date are 0

	# clear any previous current figure
	plt.gcf().clear()

	# plot daily cases
	xs = df['date'].values
	for column in columns:
		ys = df[column].values
		plt.plot(xs, ys, color=cm[column])
		plt.scatter(xs, ys, color=cm[column])
	plt.legend(columns)

	plot_param(file_name='daily-cases', col=col,
				title=title,
				xlabel=XDATE, ylabel='Number of Cases')



def plot_log(df: pd.DataFrame, col: str="") -> None:
	"""
	Plots the natural logartihm of the daily number of cases for all or a given parameter of interest in one figure.
	
	Arguments:
		df {pd.DataFrame} -- DataFrame in narrow format with each column denoting a parameter of interest
	
	Keyword Arguments:
		col {str} -- the parameter of interest (default: {""})
	"""
	title = 'Daily Cases of COVID-19'

	# plot a parameter vs. all parameters
	if col:
		columns = [col]
		df = df[df[col] != 0]
		title += f' for {col}'
	else:
		columns = COLS
		df = df.loc[df[df.columns.difference(['date'])].sum(axis=1) != 0]	# drop rows where all columns except for date are 0
	
	# clear any previous current figure
	plt.gcf().clear()

	# plot daily cases in natural logarithm scale
	xs = df['date'].values
	for column in columns:
		ys = np.log(df[column].values)
		plt.plot(xs, ys, color=cm[column])
		plt.scatter(xs, ys, color=cm[column])
	plt.legend(columns)

	plot_param(file_name='daily-cases-log', col=col,
				title=title,
				xlabel=XDATE, ylabel='Number of Cases (Logarithmic)')



def plot_daily_cases_country(df: pd.DataFrame, col: str) -> None:
	"""
	Plots the daily number of cases for top 10 countries sorted by the parameter of interest.
	
	Arguments:
		df {pd.DataFrame} -- DataFrame in narrow format with each column denoting a parameter of interest
		col {str} -- the parameter of interest
	"""
	# sort countries in descending order and extract the top 10
	df = df[['country', col]]
	countries = df.sort_values(by=col, ascending=False).head(10)['country'].to_list()
	
	# plot daily cases of each country
	for country in countries:
		df = load_dataframe(country)[['date', col]]
		df = df[df[col] != 0]
		xs = df['date'].to_list()
		ys = df[col].to_list()
		plt.plot(xs, ys)
		plt.scatter(xs, ys)
	plt.legend(countries)
	
	plot_param(file_name='daily-cases-countries', col=col,
				title=f'Daily Cases of COVID-19 by Countries for {col}', 
				xlabel=XDATE, ylabel='Number of Cases')



def plot_log_country(df: pd.DataFrame, col: str) -> None:
	"""
	Plots the natural logarithm of the daily number of cases for top 10 countries sorted by the parameter of interest.
	
	Arguments:
		df {pd.DataFrame} -- DataFrame in narrow format with each column denoting a parameter of interest
		col {str} -- the parameter of interest
	"""
	# sort countries in descending order and extract the top 10
	df = df[['country', col]]
	countries = df.sort_values(by=col, ascending=False).head(10)['country'].to_list()
	
	# plot daily cases of each country in natural logarithm scale
	for country in countries:
		df = load_dataframe(country)[['date', col]]
		df = df[df[col] != 0]
		xs = df['date'].to_list()
		ys = np.log(df[col].to_list())
		plt.plot(xs, ys)
		plt.scatter(xs, ys)
	plt.legend(countries)
	
	plot_param(file_name='daily-cases-countries-log', col=col,
				title=f'Daily Cases of COVID-19 by Countries for {col}', 
				xlabel=XDATE, ylabel='Number of Cases (Logarithmic)')