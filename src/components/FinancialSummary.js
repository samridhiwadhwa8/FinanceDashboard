import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet, PiggyBank, CreditCard } from 'lucide-react';

const FinancialSummary = ({ totalBalance, totalIncome, totalExpenses, netSavings, trends }) => {
  const summaryCards = [
    {
      title: 'Total Balance',
      value: `₹${totalBalance.toLocaleString('en-IN')}`,
      color: 'bg-blue-500',
      trend: trends.balance,
      trendColor: trends.balance >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Total Income',
      value: `₹${totalIncome.toLocaleString('en-IN')}`,
      color: 'bg-green-500',
      trend: trends.income,
      trendColor: trends.income >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Total Expenses',
      value: `₹${totalExpenses.toLocaleString('en-IN')}`,
      color: 'bg-red-500',
      trend: trends.expenses,
      trendColor: trends.expenses >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Net Savings',
      value: `₹${netSavings.toLocaleString('en-IN')}`,
      color: 'bg-purple-500',
      trend: trends.savings,
      trendColor: trends.savings >= 0 ? 'text-green-600' : 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryCards.map((card, index) => {
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
              </div>
              <div className={`flex items-center ${card.trendColor}`}>
                {card.trend >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(card.trend)}%
                </span>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default FinancialSummary;
