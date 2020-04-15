import os
import sys
import numpy as np
import pandas as pd

from utils import *
from config import *
from visualize import *
from statsmodels.tsa.arima_model import ARIMA



def arima(df: pd.DataFrame, col: str) -> None:
	"""
	Forecasts the predictions of the DataFrame using the ARIMA model.
	
	Arguments:
		df {pd.DataFrame} -- DataFrame in narrow format with each column denoting a parameter of interest
		col {str} -- parameter of interest
	"""
	# number of values to forecast
	STEPS = PAST + FUTURE

	# redirect standard output to file of parameter of interest
	path = os.path.join(FIGURES, col)
	original_stdout = sys.stdout
	f = open(os.path.join(path, f'{col}.txt'), 'w')
	sys.stdout = f

	# plot graphs about the parameter of interest
	plot_daily_change(df, col)
	plot_daily_cases(df, col)
	plot_log(df, col)
	plot_daily_cases_country(df_country, col)
	plot_log_country(df_country, col)

	# filter data
	df = df[['date', col]]
	df = df[df[col] != 0]
	df = df.set_index('date')
	df_past = df[-PAST - 1:]
	if PAST:
		df = df[:-PAST]

	# compute natural logarithm of DataFrame
	df_log = np.log(df)

	# ACF and PACF test
	df_stat = get_stationary(df, col)
	plot_autocorrelation(df_stat, col)
	
	# ARIMA - (pacf, differencing, acf)
	m_order = {'confirmed': (1, 2, 1), 'deaths': (2, 2, 3), 'recovered': (4, 2, 1), 'active': (1, 2, 1)}
	order = m_order[col]
	
	# create ARIMA model
	model = ARIMA(df_log, order=order)
	results = model.fit(disp=0)
	print(results.summary())
	
	# residual sum of squares
	plt.plot(df_stat)
	plt.plot(results.fittedvalues, color='red')
	plot_param(file_name='RSS', col=col,
				title=f'RSS of {col}: %.4f' % sum((results.fittedvalues - df_stat[col])**2),
				xlabel=XDATE)

	# ARIMA gets pattern
	results.plot_predict(start=2, end=df_stat.shape[0] - 1 + STEPS)	# start = second-order difference
	plot_param(file_name='ARIMA-results', col=col,
				title='Growth of COVID-19',
				ylabel='Number of Cases (Logarithmic)')
	values = results.forecast(steps=STEPS)
	
	# convert back to original DataFrame predictions
	pred_diff = pd.Series(results.fittedvalues, copy=True)
	pred_sum = pred_diff.cumsum().cumsum()
	pred_0 = pd.Series(df_log[col].iloc[0], index=df_log.index[1:]).cumsum()
	pred_1 = pd.Series(df_log[col].iloc[1], index=df_log.index[1:]).cumsum()
	pred_sub = pred_1.sub(pred_0)
	pred_add = pd.Series(df_log[col].iloc[0], index=df_log.index).add(pred_sub, fill_value=0)
	pred_log = pred_add.add(pred_sum, fill_value=0)
	pred = np.exp(pred_log)

	# create DataFrame of predictions
	pred_xs = pd.date_range(start=df.index[-1], periods=STEPS + 1)
	pred_ys = list(df.values[-1]) + list(np.exp(values[0]))
	data = {'date': pred_xs, col: pred_ys}
	df_pred = pd.DataFrame(data).set_index('date')
	
	# forecast plot
	plt.plot(df, color=cm[col])
	plt.plot(df_past, color="teal")
	plt.plot(df_pred, color="dodgerblue")
	plt.scatter(df.index, df.values, color=cm[col])
	plt.scatter(df_past.index, df_past.values, color="teal")
	plt.scatter(df_pred.index, df_pred.values, color="dodgerblue")
	plt.legend([col, 'actual', 'forecast'])
	plot_param(file_name='ARIMA-original',
				col=col, title='Growth of COVID-19',
				xlabel=XDATE, ylabel='Number of Cases')
	
	# redirect back to standard output
	sys.stdout = original_stdout
	f.close()
	
	return values



if __name__ == '__main__':
	# error handling
	os.makedirs(DATA, exist_ok=True)
	os.makedirs(FIGURES, exist_ok=True)
	for col in COLS:
		path = os.path.join(FIGURES, col)
		os.makedirs(path, exist_ok=True)

	# load the dataset
	df = load_dataframe()
	df_country = load_dataframe_country()
	df.to_csv(os.path.join(DATA, 'narrow.csv'))
	
	plot_log(df)
	plot_daily_cases(df)

	# forecast using ARIMA on each parameter of interest
	for col in COLS:
		arima(df, col)