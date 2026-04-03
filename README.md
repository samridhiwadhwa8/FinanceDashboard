# Financial Dashboard

A modern and interactive **financial dashboard** built with React to help users track income, expenses, and savings with clear insights and visualizations.
This project focuses on **clean UI, structured state management, and practical feature implementation**.

---

# Features

## Financial Summary (Top Section)

* **Total Balance** – Current available funds
* **Total Income** – Earnings (salary, deposits)
* **Total Expenses** – Spending overview
* **Net Savings** – Income − Expenses
* **Trend Indicators** – Visual ↑ ↓ performance

---

##  Transactions (Detail Section)

* View all transactions with:

  * Date
  * Amount
  * Category
  * Type (Income / Expense)

###  Functionality

* Search transactions
* Filter by category, type, and date
* Sort by amount or date
* Add transactions (Admin only)
* Responsive and clean table

---

##  Insights (Insights Section)

* Highest spending category
* Monthly comparison
* Spending patterns
* Overspending alerts
* Savings insights

---

## Data Visualizations

### Time-Based

* Line chart showing income/expense trends

###  Categorical

* Pie/Donut chart showing category-wise spending

---

## Role-Based UI (Frontend Simulation)

### Viewer

* Read-only access
* Can view data and charts

### Admin

* Add transactions
* Edit/Delete transactions

### Role Switching

* Dropdown toggle (frontend only)

---

## Dark Mode

* Smooth theme toggle
* Clean black UI
* Consistent color palette

---

## Data Persistence

* Stored using `localStorage`
* Data persists after refresh

---

## Export Feature

* Export transactions as:

  * CSV
  * JSON
  * PDF
---

## Animations

* Implemented using **Framer Motion**
* Smooth UI transitions

---

## Mock Data

* Static JSON dataset
* Easily replaceable with real APIs

---

# Technology Stack

* **Frontend:** React 18
* **Styling:** Tailwind CSS
* **State Management:** Context API
* **Charts:** Recharts
* **Animations:** Framer Motion
* **Icons:** Lucide React
* **Data:** Static Mock JSON

---

# Project Structure

```
financial-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FinancialSummary.jsx
│   │   ├── Transactions.jsx
│   │   ├── Insights.jsx
│   │   ├── Charts.jsx
│   │
│   ├── context/
│   │   └── FinanceContext.jsx
│   │
│   ├── data/
│   │   └── mockData.js
│   │
│   ├── utils/
│   │   └── calculations.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── index.js
├── package.json
├── tailwind.config.js
└── README.md
```

---

# State Management

Centralized using **Context API**

* transactions → core data
* filters → UI logic
* role → access control

**Flow:**
User Action → State Update → UI Re-render

---

# Key Features Explained

## Financial Summary

* Real-time calculations
* Trend indicators
* Clean card UI

## Transaction Management

* CRUD operations (Admin)
* Multi-filter support
* Search + sorting

## Insights System

* Category analysis
* Monthly comparison
* Smart alerts

---

# Responsiveness

* Fully responsive layout
* Mobile-friendly design

---

# Assumptions

* Static/mock data used
* No backend integration
* Role-based access simulated

---

# Edge Case Handling

* Empty state → No transactions available
* Safe filtering
* Handles large datasets

---

# Enhancements

* Dark mode
* Local storage persistence
* Export functionality
* Framer Motion animations
* Advanced filtering

---

# Installation

## Prerequisites

* Node.js (v14 or higher)

## Steps

```
git clone <your-repo-url>
cd financial-dashboard
npm install
npm start
```

---

## Build for Production

```
npm run build
```

---

# Approach

The dashboard is divided into three layers:

1. Summary → Quick overview
2. Transactions → Detailed exploration
3. Insights → Data understanding

---

# Learning Outcomes

* Context API state management
* Dashboard UI design
* Data visualization

---

# Future Enhancements

* Backend integration
* Authentication system
* Real-time data
* ML-based predictions

---

Built as part of an evaluation assignment focusing on clean UI and structured implementation.
