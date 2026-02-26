import yfinance as yf
import numpy as np
import pandas as pd
from datetime import timedelta
from scipy.stats import norm
from scipy.optimize import brentq
from scipy.interpolate import griddata, interp1d
from fredapi import Fred
import pytz
from rest_framework.exceptions import APIException

MARKET_TZ = pytz.timezone("America/New_York")
now = pd.Timestamp.now(tz=MARKET_TZ)
today = now.normalize()

# Initialise fred with api key
fred = Fred(api_key="b83b1f9335bd51ee7d17eb6597ed60c8")

# Series IDs for Market Yield on U.S. Treasury Securities
series_ids = {
    "1M": "DGS1MO",
    "3M": "DGS3MO",
    "6M": "DGS6MO",
    "1Y": "DGS1",
    "2Y": "DGS2",
    "3Y": "DGS3",
    "5Y": "DGS5",
    "7Y": "DGS7",
    "10Y": "DGS10",
    "20Y": "DGS20",
    "30Y": "DGS30"
}

def bs_call_price(S, K, T, r, v, q=0):
    """
    Calculate call price with the black scholes formula.

    :param S: Last closed spot price
    :param K: Strike price
    :param T: Time to expiry in annual fraction format (e.g days/365)
    :param r: Risk free rate
    :param v: Volatility
    :param q: Dividend yield
    """
    if S <= 0 or K <= 0 or T <= 0 or v <= 0:
        return np.nan
    
    try:
        d1 = (np.log(S / K) + (r - q + 0.5 * v ** 2) * T) / (v * np.sqrt(T))
        d2 = d1 - v * np.sqrt(T)

        return S * np.exp(-q * T) * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    
    except Exception:
        return np.nan

def implied_volatility(price, S, K, T, r, q=0):
    """
    Calculate implied volatility using the black scholes formula. \n
    Uses the Brent root-finding method to solve for the volatility (v) that makes the \n
    theoretical black scholes price equal to the observed market price (mid-price).

    :param price: Mid price
    :param S: Last closed spot price
    :param K: Strike price
    :param T: Time to expiry in annual fraction format (e.g days/365)
    :param r: Risk free rate
    :param q: Dividend yield
    """
    if T <= 0 or price <= 0 or S <= 0 or K <= 0:
        return np.nan
    
    def objective_function(v): return bs_call_price(S, K, T, r, v, q) - price

    try:
        return brentq(objective_function, 1e-6, 5)
    
    except Exception:
        return np.nan
    
def fetch_us_treasury_rates():
    """
    Fetch the latest yields for all series from FRED.
    Returns a dict of series_id -> yield (decimal)
    """
    rates = {}
    for label, series_id in series_ids.items():
        series = fred.get_series(series_id)
        if series is None or series.dropna().empty:
            raise Exception(f"No data for {label} treasury yield.")
        rates[series_id] = series.dropna().tail(1).iloc[-1] / 100.0

    if len(rates) < len(series_ids):
        raise Exception("Some maturities missing in treasury data.")
    
    return rates

def create_interpolator(rates_dict):
    """
    Returns an interpolator function that converts time-to-expiry T to interpolated risk-free rate.
    """
    try:
        # X-axis: maturities in years
        maturities_t = np.array([
            30.416/365,  # ~1 Month
            91.25/365,   # ~3 Months
            182.5/365,   # ~6 Months
            1,           # 1 Year
            2, 3, 5, 7, 10, 20, 30        
        ])

        # Y-axis: yields corresponding to maturities
        yields = np.array(list(rates_dict.values()))

        if np.isnan(yields).any() or len(yields) != len(maturities_t):
            raise Exception("Treasury yield data is incomplete or corrupt.")

        # Create interpolator function
        return interp1d(maturities_t, yields, kind="linear", fill_value="extrapolate")
    
    except Exception as e:
        raise Exception(f"Failed to create interpolator: {str(e)}")
    
def calculate_iv(ticker_symbol, q, min_strike_pct, max_strike_pct, r_interp):
    """
    Calculates implied volatilities for call options of a given ticker and returns relevant data for graph plotting.

    :param ticker_symbol: Ticker symbol
    :param q: Dividend yield
    :param min_strike_pct: Lower bound for strike price range (% of spot price)
    :param max_strike_pct: Upper bound for strike price range (% of spot price)
    """
    # Create ticker object    
    ticker = yf.Ticker(ticker_symbol)

    # Check if ticker exists
    info = ticker.info
    if not info or 'regularMarketPrice' not in info:
        raise Exception(f"Ticker '{ticker_symbol}' does not exist. Please enter a valid ticker symbol.")

    # Fetch available options that expire at least 1 week later (expiry < 1 week is too volatile)
    try:
        expirations = [pd.Timestamp(e, tz=MARKET_TZ) for e in ticker.options if pd.Timestamp(e, tz=MARKET_TZ) > today + timedelta(days=7)]

    except Exception:
        raise Exception("No valid expirations beyond one week. Try a different ticker.")

    # Fetch recent close for spot price
    try:
        spot = ticker.history(period="5d")["Close"].iloc[-1]

    except Exception:
        raise Exception("Unable to retrieve recent spot price. Try again later.")
    
    data = []
    total_calls = 0
    total_valid = 0
    
    for exp in expirations:
        try:
            # Fetch option chain for current expiry date
            chain = ticker.option_chain(exp.strftime("%Y-%m-%d"))

        except Exception:
            continue
        
        # Fetch call from chain (filter out illiquid or bad data)
        calls = chain.calls[(chain.calls["bid"] > 0) & (chain.calls["ask"] > 0)]
        total_calls += len(calls)

        for _, row in calls.iterrows():
            strike = row["strike"]
            mid = (row["bid"] + row["ask"]) / 2
            T = (exp - today).days / 365 # Time to expiry in annual fraction
            r = r_interp(T) # Risk free rate based on T
            iv = implied_volatility(mid, spot, strike, T, r, q) # Calculate iv

            if np.isnan(iv):
                continue

            total_valid += 1

            # Append relevant data to data
            data.append({
                "expiration": exp.strftime("%Y-%m-%d"),
                "strike": strike,
                "timeToExpiration": T,
                "impliedVolatility": iv*100
            })

    # Data sufficiency checks
    if total_calls == 0:
        raise Exception("No liquid call options (non-zero bid/ask) found. Try a different ticker.")
    if total_valid == 0:
        raise Exception("Implied volatility could not be computed for any options. This may happen if the selected strike range is too extreme or the options are illiquid. Try adjusting the strike range or dividend yield.")
    
    # Convert data to dataframe
    df = pd.DataFrame(data)

    # Only calls where strike price is within range
    df = df[
            (df['strike'] >= spot * (min_strike_pct / 100)) &
            (df['strike'] <= spot * (max_strike_pct / 100))
        ]
    
    if df.empty:
        raise Exception("All valid options were outside of the strike range. Try widening your strike range.")
    
    df.sort_values('strike', inplace=True)

    Y = df["strike"].values
    X = df["timeToExpiration"].values
    Z = df["impliedVolatility"].values

    if len(X) < 3 or len(Y) < 3:
        raise Exception("Not enough data points to plot a surface. Try a broader strike range or another ticker.")
    
    # Interpolation
    try:
        ti = np.linspace(X.min(), X.max(), 50)
        ki = np.linspace(Y.min(), Y.max(), 50)
        T, K = np.meshgrid(ti, ki)
        Zi = griddata((X, Y), Z, (T, K), method="linear")
        Zi = np.ma.array(Zi, mask=np.isnan(Zi))

    except Exception:
        raise Exception("Interpolation failed. Data may be too sparse or irregular.")

    print(f"x: {len(T)}, y: {len(K)}, z: {len(Zi)}")

    return {
        "spot": spot,
        "x": T.tolist(),
        "y": K.tolist(),
        "z": Zi.tolist()
    }

