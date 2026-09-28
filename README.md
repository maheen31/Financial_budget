# Finlytics — Financial Expense & Budget Analytics (React)

Updated version with **5 working pages** and a functional **Export Data** button.

## Pages
1. Overview — executive dashboard, trend, spend mix, budget vs actual.
2. Budget Control — allocation, actuals, variance and utilization.
3. Categories — category-level spending and distribution.
4. Transactions — searchable/filterable transaction register.
5. Insights — automated observations and trend analysis.

## Export
Click **Export Data** on any page to download `finlytics_transactions.csv`.

## Run
Open this folder in VS Code:
```powershell
npm install
npm run dev
```
Then open the Vite Local URL, normally `http://localhost:5173/`.

## Build test
```powershell
npm run build
```

The app uses demo data and does not require Python, FastAPI, a database, or a backend.
