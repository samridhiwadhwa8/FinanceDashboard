import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar, PiggyBank, ShoppingCart } from 'lucide-react';

const SmartInsights = ({ transactions }) => {
  const insights = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Filter current month transactions
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });

    const previousMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return transactionDate.getMonth() === prevMonth && transactionDate.getFullYear() === prevYear;
    });

    // Calculate category totals
    const categoryTotals = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    // Monthly totals
    const currentMonthTotal = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousMonthTotal = previousMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Find highest spending category
    const highestCategory = Object.entries(categoryTotals).reduce((max, [category, amount]) => 
      amount > max.amount ? { category, amount } : max
    , { category: 'None', amount: 0 });

    // Calculate monthly change
    const monthlyChange = previousMonthTotal > 0 ? 
      ((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100) : 0;

    // Weekly spending pattern
    const weeklySpending = {};
    currentMonthTransactions.forEach(t => {
      if (t.type === 'expense') {
        const weekNumber = Math.ceil(new Date(t.date).getDate() / 7);
        weeklySpending[weekNumber] = (weeklySpending[weekNumber] || 0) + t.amount;
      }
    });

    // Find most frequent category
    const categoryFrequency = {};
    currentMonthTransactions.forEach(t => {
      if (t.type === 'expense') {
        categoryFrequency[t.category] = (categoryFrequency[t.category] || 0) + 1;
      }
    });

    const mostFrequentCategory = Object.entries(categoryFrequency).reduce((max, [category, count]) => 
      count > max.count ? { category, count } : max
    , { category: 'None', count: 0 });

    // Calculate average transaction size
    const expenseTransactions = currentMonthTransactions.filter(t => t.type === 'expense');
    const avgTransactionSize = expenseTransactions.length > 0 ? 
      currentMonthTotal / expenseTransactions.length : 0;

    // Generate insights
    const generatedInsights = [];

    // 1. Highest Spending Category
    if (highestCategory.category !== 'None') {
      generatedInsights.push({
        type: 'category',
        icon: Target,
        title: 'Highest Spending Category',
        value: highestCategory.category,
        amount: highestCategory.amount,
        description: `${highestCategory.category} is your highest expense category this month`,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      });
    }

    // 2. Monthly Comparison
    if (monthlyChange !== 0) {
      const isIncrease = monthlyChange > 0;
      generatedInsights.push({
        type: 'trend',
        icon: isIncrease ? TrendingUp : TrendingDown,
        title: isIncrease ? 'Monthly Spending Increase' : 'Monthly Spending Decrease',
        value: `${Math.abs(monthlyChange).toFixed(1)}%`,
        amount: Math.abs(currentMonthTotal - previousMonthTotal),
        description: `Spending ${isIncrease ? 'increased' : 'decreased'} by ₹${Math.abs(currentMonthTotal - previousMonthTotal).toLocaleString('en-IN')} (${Math.abs(monthlyChange).toFixed(1)}%) compared to last month`,
        color: isIncrease ? 'text-red-600' : 'text-green-600',
        bgColor: isIncrease ? 'bg-red-50' : 'bg-green-50'
      });
    }

    // 3. Weekly Pattern Analysis
    const weeks = Object.keys(weeklySpending);
    if (weeks.length > 1) {
      const weekSpendingArray = Object.values(weeklySpending);
      const avgWeeklySpending = weekSpendingArray.reduce((sum, amount) => sum + amount, 0) / weeks.length;
      const highestWeekSpending = Math.max(...weekSpendingArray);
      
      generatedInsights.push({
        type: 'pattern',
        icon: Calendar,
        title: 'Weekly Spending Summary',
        value: `Avg ₹${Math.round(avgWeeklySpending).toLocaleString('en-IN')}`,
        amount: highestWeekSpending,
        description: `Avg weekly spending ₹${Math.round(avgWeeklySpending).toLocaleString('en-IN')}, highest week ₹${Math.round(highestWeekSpending).toLocaleString('en-IN')}`,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      });

      // Check if most spending happens on weekends
      const weekendSpending = currentMonthTransactions.filter(t => {
        const day = new Date(t.date).getDay();
        return day === 0 || day === 6; // Sunday or Saturday
      }).reduce((sum, t) => sum + t.amount, 0);

      const weekdaySpending = currentMonthTotal - weekendSpending;
      
      if (weekendSpending > weekdaySpending * 0.3) {
        generatedInsights.push({
          type: 'pattern',
          icon: Calendar,
          title: 'Weekend Spending Pattern',
          value: `${((weekendSpending / currentMonthTotal) * 100).toFixed(1)}%`,
          amount: weekendSpending,
          description: `Most expenses happen on weekends (${((weekendSpending / currentMonthTotal) * 100).toFixed(1)}%)`,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        });
      }
    }

    // 4. Large Transaction Alert
    const largeTransactions = expenseTransactions.filter(t => t.amount > avgTransactionSize * 2);
    if (largeTransactions.length > 0) {
      const largestTransaction = largeTransactions.reduce((max, t) => t.amount > max.amount ? t : max, largeTransactions[0]);
      
      generatedInsights.push({
        type: 'alert',
        icon: AlertTriangle,
        title: 'Large Transaction Alert',
        value: largestTransaction.category,
        amount: largestTransaction.amount,
        description: `Unusually large expense: ₹${largestTransaction.amount.toLocaleString('en-IN')} for ${largestTransaction.category}`,
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      });
    }

    // 5. Frequent Category
    if (mostFrequentCategory.category !== 'None') {
      generatedInsights.push({
        type: 'frequency',
        icon: ShoppingCart,
        title: 'Most Frequent Category',
        value: mostFrequentCategory.category,
        amount: mostFrequentCategory.count,
        description: `You shop frequently at ${mostFrequentCategory.category} (${mostFrequentCategory.count} transactions this month)`,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      });
    }

    // 6. Savings Insight
    const currentMonthIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = currentMonthIncome - currentMonthTotal;
    const savingsRate = currentMonthIncome > 0 ? (savings / currentMonthIncome * 100) : 0;

    if (savings > 0) {
      generatedInsights.push({
        type: 'savings',
        icon: PiggyBank,
        title: 'Monthly Savings',
        value: `${savingsRate.toFixed(1)}%`,
        amount: savings,
        description: `Great! You saved ₹${savings.toLocaleString('en-IN')} this month (${savingsRate.toFixed(1)}% savings rate)`,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      });
    } else if (savings < 0) {
      generatedInsights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Monthly Deficit',
        value: `${Math.abs(savingsRate).toFixed(1)}%`,
        amount: Math.abs(savings),
        description: `Warning: You spent ₹${Math.abs(savings).toLocaleString('en-IN')} more than you earned this month`,
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      });
    }

    return {
      highestCategory,
      monthlyChange,
      currentMonthTotal,
      previousMonthTotal,
      savings,
      savingsRate,
      insights: generatedInsights
    };
  }, [transactions]);

  const getInsightIcon = (type) => {
    const iconMap = {
      'category': Target,
      'trend': TrendingUp,
      'pattern': Calendar,
      'alert': AlertTriangle,
      'frequency': ShoppingCart,
      'savings': PiggyBank,
      'warning': AlertTriangle
    };
    return iconMap[type] || Target;
  };

  return (
    <div className="bg-white rounded-xl p-6 card-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <Target className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">Smart Insights</h3>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700 font-medium">Highest Category</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{insights.highestCategory.category}</p>
          <p className="text-sm text-purple-700">₹{insights.highestCategory.amount.toLocaleString('en-IN')}</p>
        </div>

        <div className={`bg-gradient-to-br rounded-lg p-4 ${
          insights.monthlyChange > 0 
            ? 'from-red-50 to-red-100' 
            : 'from-green-50 to-green-100'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {insights.monthlyChange > 0 ? (
              <TrendingUp className="w-5 h-5 text-red-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-green-600" />
            )}
            <span className={`font-medium ${
              insights.monthlyChange > 0 ? 'text-red-700' : 'text-green-700'
            }`}>
              Monthly Change
            </span>
          </div>
          <p className={`text-2xl font-bold ${
            insights.monthlyChange > 0 ? 'text-red-900' : 'text-green-900'
          }`}>
            {insights.monthlyChange > 0 ? '+' : ''}{Math.abs(insights.monthlyChange).toFixed(1)}%
          </p>
          <p className={`text-sm ${
            insights.monthlyChange > 0 ? 'text-red-700' : 'text-green-700'
          }`}>
            ₹{Math.abs(insights.currentMonthTotal - insights.previousMonthTotal).toLocaleString('en-IN')} vs last month
          </p>
        </div>

        <div className={`bg-gradient-to-br rounded-lg p-4 ${
          insights.savings > 0 
            ? 'from-green-50 to-green-100' 
            : 'from-orange-50 to-orange-100'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {insights.savings > 0 ? (
              <PiggyBank className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            )}
            <span className={`font-medium ${
              insights.savings > 0 ? 'text-green-700' : 'text-orange-700'
            }`}>
              {insights.savings > 0 ? 'Savings' : 'Deficit'}
            </span>
          </div>
          <p className={`text-2xl font-bold ${
            insights.savings > 0 ? 'text-green-900' : 'text-orange-900'
          }`}>
            {insights.savings > 0 ? '+' : ''}₹{Math.abs(insights.savings).toLocaleString('en-IN')}
          </p>
          <p className={`text-sm ${
            insights.savings > 0 ? 'text-green-700' : 'text-orange-700'
          }`}>
            {insights.savings > 0 ? `${insights.savingsRate.toFixed(1)}% savings rate` : `${Math.abs(insights.savingsRate).toFixed(1)}% deficit rate`}
          </p>
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Detailed Observations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.insights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <div
                key={index}
                className={`${insight.bgColor} border border-gray-200 rounded-lg p-4`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`w-5 h-5 mt-0.5 ${insight.color}`} />
                  <div className="flex-1">
                    <h5 className={`font-semibold ${insight.color} mb-1`}>
                      {insight.title}
                    </h5>
                    <p className="text-sm text-gray-700 mb-2">
                      {insight.description}
                    </p>
                    {insight.amount && (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          {insight.type === 'frequency' ? insight.amount : `₹${insight.amount.toLocaleString('en-IN')}`}
                        </span>
                        {insight.value && (
                          <span className={`text-sm font-medium ${insight.color}`}>
                            ({insight.value})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SmartInsights;
