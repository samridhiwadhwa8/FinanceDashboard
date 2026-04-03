# Financial Dashboard

A comprehensive financial dashboard built with React that helps users track their income, expenses, and savings with intelligent insights.

## Features

### Financial Summary (TOP SECTION)
- **Total Balance**: Current money available
- **Total Income**: Salary, deposits, etc.
- **Total Expenses**: Spending tracking
- **Net Savings**: Income − Expenses
- **Trend Indicators**: Visual ↑ ↓ indicators for each metric

###  Transaction Management (DETAIL SECTION)
- **Transaction List**: Complete transaction history with date, amount, category, and type
- **Advanced Filters**: Filter by date range, category, amount, and type
- **Search Functionality**: Find specific transactions quickly
- **Add Transactions**: Input form for new transactions with validation
- **Responsive Table**: Clean, sortable transaction view

###  Spending Insights (INSIGHTS SECTION)
- **Category-wise Spending**: Pie/donut chart showing spending distribution
- **Monthly Trends**: Line chart tracking income vs expenses over time
- **Top Expenses**: List of highest individual expenses
- **AI-Powered Insights**: Smart suggestions and alerts
- **Spending Analysis**: Automated recommendations for saving money

## Technology Stack

- **Frontend**: React 18
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Create React App

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd financial-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build for Production

```bash
npm run build
```

## Project Structure

```
financial-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FinancialSummary.js    # Summary cards with trends
│   │   ├── Transactions.js        # Transaction management
│   │   └── SpendingInsights.js    # Charts and AI insights
│   ├── data/
│   │   └── mockData.js           # Sample data
│   ├── App.js                    # Main application component
│   ├── index.css                 # Global styles
│   └── index.js                  # Entry point
├── package.json
├── tailwind.config.js
└── README.md
```

## Key Features Explained

### Financial Summary Cards
- Real-time balance calculations
- Visual trend indicators (up/down arrows)
- Color-coded metrics for quick understanding
- Responsive grid layout

### Transaction Management
- Full CRUD operations for transactions
- Multi-criteria filtering (date, category, type, search)
- Inline transaction addition
- Sortable and searchable transaction table

### AI-Powered Insights
- Spending pattern analysis
- Category-wise budget recommendations
- Savings rate calculations
- Automated spending alerts
- Personalized financial suggestions

## Customization

### Adding New Categories
Edit `src/data/mockData.js` and update the `categories` array:

```javascript
export const categories = [
  'Food', 'Travel', 'Shopping', 'Bills', 
  'Entertainment', 'Healthcare', 'Salary', 
  'Freelance', 'Investment', 'YourNewCategory'
];
```

### Updating Trends
Modify the trend values in `src/App.js`:

```javascript
const trends = {
  balance: 12.5,  
  income: 8.3,
  expenses: -5.2,
  savings: 15.7
};
```


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- [ ] Real-time data synchronization
- [ ] Bank account integration
- [ ] Advanced ML predictions
- [ ] Budget planning tools
- [ ] Export functionality (PDF, Excel)
- [ ] Mobile app version
- [ ] Multi-currency support
- [ ] Goal setting and tracking
