import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Target, ArrowUp, ArrowDown } from 'lucide-react';

const AnimatedFinancialSummary = ({ totalBalance, totalIncome, totalExpenses, netSavings, trends }) => {
  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;
  
  const summaryCards = [
    {
      title: 'Total Balance',
      amount: totalBalance,
      icon: DollarSign,
      color: totalBalance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: totalBalance >= 0 ? 'bg-green-50' : 'bg-red-50',
      borderColor: totalBalance >= 0 ? 'border-green-200' : 'border-red-200',
      trend: trends.balance,
      description: 'Current available funds'
    },
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: ArrowUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      trend: trends.income,
      description: 'Money earned this period'
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      icon: ArrowDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      trend: trends.expenses,
      description: 'Money spent this period'
    },
    {
      title: 'Net Savings',
      amount: netSavings,
      icon: PiggyBank,
      color: netSavings >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: netSavings >= 0 ? 'bg-green-50' : 'bg-red-50',
      borderColor: netSavings >= 0 ? 'border-green-200' : 'border-red-200',
      trend: trends.savings,
      description: 'Money saved after expenses'
    }
  ];

  const TrendIcon = ({ trend, isPositive }) => {
    if (trend > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (trend < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    } else {
      return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-black rounded-xl p-6 card-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Financial Overview</h2>
        </motion.div>
        <p className="text-gray-600 dark:text-gray-400">Track your income, expenses, and savings at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className={`${card.bgColor} border ${card.borderColor} rounded-xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  {React.createElement(card.icon, {
                    className: `w-6 h-6 ${card.color}`
                  })}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{card.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{card.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendIcon trend={card.trend} isPositive={card.trend > 0} />
                <span className={`text-sm font-medium ${
                  card.trend > 0 ? 'text-green-600' : 
                  card.trend < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {card.trend > 0 ? '+' : card.trend < 0 ? '' : ''}{Math.abs(card.trend).toFixed(1)}%
                </span>
              </div>
            </div>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-gray-300 dark:from-transparent dark:via-gray-700 dark:to-gray-600"
            />
            
            <div className="mt-4">
              <p className={`text-2xl font-bold ${card.color}`}>
                {formatCurrency(card.amount)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedFinancialSummary;
