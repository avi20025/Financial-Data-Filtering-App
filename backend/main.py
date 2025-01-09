from fastapi import FastAPI, Query
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import requests

app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost:3000",  # Frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow only the frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

API_KEY = "IKKLSO57LW7GbaqMu3gVYFPmmBXm5UKf"
BASE_URL = "https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey="

# Function to filter data by date range
def filter_by_date(data, start_date, end_date):
    return [
        item for item in data
        if start_date <= datetime.strptime(item["Date"], "%Y-%m-%d") <= end_date
    ]

# Function to filter data by revenue range
def filter_by_revenue(data, min_revenue, max_revenue):
    return [
        item for item in data
        if min_revenue <= item["Revenue"] <= max_revenue
    ]

# Function to filter data by net income
def filter_by_net_income(data, min_net_income, max_net_income):
    return [
        item for item in data
        if min_net_income <= item["Net Income"] <= max_net_income 
    ]

# Function to sort data
def sort_data(data, sort_by, descending):
    return sorted(data, key=lambda x: x[sort_by], reverse=descending)

@app.get("/fetch_data")
def fetch_data(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    min_revenue: Optional[float] = None,
    max_revenue: Optional[float] = None,
    min_net_income: Optional[float] = None,
    max_net_income: Optional[float] = None,
    sort_by: Optional[str] = "Date",
    descending: Optional[bool] = False,
):

    url = f"{BASE_URL}{API_KEY}"

    response = requests.get(url)


    if response.status_code == 200:
        data = response.json()

        # Extracting relevant fields from the data
        table_data = []
        for item in data:
            table_data.append({
                "Date": item.get("date"),
                "Revenue": item.get("revenue"),
                "Net Income": item.get("netIncome"),
                "Gross Profit": item.get("grossProfit"),
                "Earnings Per Share (EPS)": item.get("eps"),
                "Operating Income": item.get("operatingIncome"),
            })

        # Filtering by date range if provided
        if start_date and end_date:
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
            end_date = datetime.strptime(end_date, "%Y-%m-%d")
            table_data = filter_by_date(table_data, start_date, end_date)

        # Filtering by revenue range if provided
        if min_revenue is not None and max_revenue is not None:
            table_data = filter_by_revenue(table_data, min_revenue, max_revenue)

        # Filtering by net income range if provided
        if min_net_income is not None and max_net_income is not None:
            table_data = filter_by_net_income(table_data, min_net_income, max_net_income)

        # Sorting the data based on declared sorting criteria
        if sort_by:
            table_data = sort_data(table_data, sort_by, descending)

        return table_data
    else:
        return {"error": "Failed to fetch data", "status_code": response.status_code}