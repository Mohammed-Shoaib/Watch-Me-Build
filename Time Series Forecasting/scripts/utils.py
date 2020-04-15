import os
import numpy as np
import pandas as pd

from config import *
from typing import List
from github import Github
from collections import defaultdict
from urllib.request import urlretrieve
from datetime import date, datetime, timedelta
from statsmodels.tsa.stattools import adfuller, acf, pacf



def download() -> List[str]:
	"""
	Downloads the COVID-19 dataset from the github repository of CSSEGISandData.
	
	Returns:
		List[str] -- path names corresponding to each parameter of interest
	"""
	os.makedirs(DATA, exist_ok=True)
	paths = []
	g = Github(access_token)
	repo = g.get_repo('CSSEGISandData/COVID-19')
	files = repo.get_contents('csse_covid_19_data/csse_covid_19_time_series')
	names = ['time_series_covid19_confirmed_global.csv', 'time_series_covid19_deaths_global.csv', 'time_series_covid19_recovered_global.csv']

	for f in files:
		file_name = os.path.basename(f.path)
		if file_name not in names:
			continue
		path = os.path.join(DATA, file_name.split('-')[-1])
		paths.append(path)
		print(f'Downloading {path}...')
		urlretrieve(f.download_url, path)
	print()
	return sorted(paths)[:3]



def generate_dates() -> List[date]:
	"""
	Generates a date range from 31st December, 2019 to today.
	
	Returns:
		List[date] -- an ordered list of dates in the range [start, end]
	"""
	start = date(2019, 12, 31)
	end = (datetime.today() - timedelta(1)).date()
	dates = [d.date() for d in pd.date_range(start, end)]
	return dates



PATHS = download()
DATES = generate_dates()
COUNTRIES = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Congo (Brazzaville)', 'Congo (Kinshasa)', 'Costa Rica', "Cote d'Ivoire", 'Croatia', 'Diamond Princess', 'Cuba', 'Cyprus', 'Czechia', 'Denmark', 'Djibouti', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Guatemala', 'Guinea', 'Guyana', 'Haiti', 'Holy See', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Korea, South', 'Kuwait', 'Kyrgyzstan', 'Latvia', 'Lebanon', 'Liberia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malaysia', 'Maldives', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'San Marino', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia', 'South Africa', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Taiwan*', 'Tanzania', 'Thailand', 'Togo', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'US', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Zambia', 'Zimbabwe', 'Dominica', 'Grenada', 'Mozambique', 'Syria', 'Timor-Leste', 'Belize', 'Laos', 'Libya', 'West Bank and Gaza', 'Guinea-Bissau', 'Mali', 'Saint Kitts and Nevis', 'Kosovo', 'Burma', 'MS Zaandam']



def get_cases(path: str, country: str) -> List[int]:
	"""
	Counts the number of cases based on the DATES for the parameter of interest.
	
	Arguments:
		path {str} -- path to the dataset csv file for the parameter of interest
		country {str} -- gets cases for a country if specified
	
	Returns:
		List[int] -- an ordered list of the number of cases for each date
	"""
	# load dataset
	df = pd.read_csv(path)
	if country:
		df = df[df['Country/Region'] == country]
	df.drop(['Province/State', 'Country/Region', 'Lat', 'Long'], axis=1, inplace=True)

	# count number of cases for each day into a dictionary
	freq = defaultdict(int)
	for col in df:
		d = datetime.strptime(col, '%m/%d/%y').date()	# format of dates in the dataset
		for cases in df[col]:
			freq[d] += cases
	
	# make the ys in order of xs
	ys = [0] * len(DATES)
	for i in range(len(DATES)):
		ys[i] = freq[DATES[i]]
	
	return ys



def get_cases_country(path: str) -> List[int]:
	"""
	Counts the number of cases based on the COUNTRIES for the parameter of interest.
	
	Arguments:
		path {str} -- path to the dataset csv file for the parameter of interest
	
	Returns:
		List[int] -- an ordered list of the number of cases for each country
	"""
	# load the dataset
	df = pd.read_csv(path)
	df = df.set_index('Country/Region')
	df = df.iloc[:, -1]
	
	# count number of cases for each country into a dictionary
	freq = defaultdict(int)
	for country, cases in df.iteritems():
		freq[country] += cases
	
	# make the ys in order of xs
	ys = [0] * len(COUNTRIES)
	for i in range(len(COUNTRIES)):
		ys[i] = freq[COUNTRIES[i]]
	
	return ys



def load_dataframe(country: str="") -> pd.DataFrame:
	"""
	Creates a DataFrame based on the DATES with columns for each parameter of interest.
	
	Keyword Arguments:
		country {str} -- loads dataset only for given country if specified (default: {""})
	
	Returns:
		pd.DataFrame -- DataFrame in narrow format with each column denoting a parameter of interest
	"""
	# PATHS is an alphabetically sorted list
	confirmed, deaths, recovered = PATHS

	# load dataset for each parameter of interest
	confirmed = get_cases(confirmed, country)
	deaths = get_cases(deaths, country)
	recovered = get_cases(recovered, country)
	active = [confirmed[i] - deaths[i] - recovered[i] for i in range(len(DATES))]

	# create pandas DataFrame
	data = {'date': DATES, 'confirmed': confirmed, 'recovered': recovered, 'deaths': deaths, 'active': active}
	df = pd.DataFrame(data)
	df['date'] = pd.to_datetime(df['date'])

	return df



def load_dataframe_country() -> pd.DataFrame:
	"""
	Creates a DataFrame based on the COUNTRIES with columns for each parameter of interest.
	
	Returns:
		pd.DataFrame -- DataFrame in narrow format with each column denoting a parameter of interest
	"""
	# PATHS is an alphabetically sorted list
	confirmed, deaths, recovered = PATHS

	# load dataset for each parameter of interest
	confirmed = get_cases_country(confirmed)
	deaths = get_cases_country(deaths)
	recovered = get_cases_country(recovered)
	active = [confirmed[i] - deaths[i] - recovered[i] for i in range(len(COUNTRIES))]

	# create pandas DataFrame
	data = {'country': COUNTRIES, 'confirmed': confirmed, 'recovered': recovered, 'deaths': deaths, 'active': active}
	df = pd.DataFrame(data)

	return df



def print_df(df: pd.DataFrame) -> None:
	"""
	Prints the entire DataFrame.
	
	Arguments:
		df {pd.DataFrame} -- DataFrame to be printed
	"""
	with pd.option_context('display.max_rows', None, 'display.max_columns', None):
		print(df)