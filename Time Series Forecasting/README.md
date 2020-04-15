# Time Series Forecasting

## Introduction

Coronavirus (COVID-19) is an infectious disease causing a pandemic around the world. A pandemic disease spreads very quickly i.e., at an exponential rate. Most people affected experience respiratory illness and recover without special treatment. However, for older people it is a different story. People over the age of 65 experience underlying medical problems like diabetes, chronic respiratory pain, cardiovascular disease, and even cancer in certain cases. Hence, it is very important we keep ourselves aware and take precautionary measures.

<p align="center"><img src="assets/protect-yourself.png" height=300px></p>

The goal of this project is to forecast the spread of COVID-19 and its future consequences using the statistical model ARIMA.

We will be mainly looking at _four_ parameters of interest:

*	**Confirmed**: The person has been or was affected by coronavirus.
*	**Deaths**: The person was affected by the coronavirus but has unfortunately died.
*	**Recovered**: The person was affected by the coronavirus but has now recovered.
*	**Active**: The person is affected by the coronavirus and has not yet recovered.

### Install dependencies

You will require the following dependencies:

* [Python 3](https://www.python.org/downloads/)
* [Numpy](https://www.scipy.org/install.html)
* [Matplotlib](https://matplotlib.org/3.1.1/users/installing.html)
* [statsmodels](https://www.statsmodels.org/stable/install.html)

### Configuration

Open [config.py](scripts/config.py) to tweak the settings. You will see many parameters that can be changed. The most important ones are:

*	`access_token`: you can refer to [this](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) page on how you can obtain a personal access token.
*	`FUTURE`: number of future days from today to forecast, must be a value > 0 (otherwise what's the point of time series forecasting?).
*	`PAST`: number of past days from today to forecast, can be used to check the performance.
*	`DATA`: path to directory to output dataset, will create it if it does not already exist.
*	`FIGURES`: path to directory to output figures, will create it if it does not already exist.

### Run the script!

The python script can be run with a single command

```bash
python -W ignore main.py	# ignore warning messages
```

This will download the dataset in the `DATA` directory and generate all the figures in the `FIGURES` directory. You can view the results [here](figures/).