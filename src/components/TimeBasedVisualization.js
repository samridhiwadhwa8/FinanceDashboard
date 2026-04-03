import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Calendar, AlertTriangle, Target } from 'lucide-react';

const TimeBasedVisualization = ({ transactions = [], monthlyData = [] }) => {
  const timeBasedData = useMemo(() => {
    // Early return if transactions is empty or undefined
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Daily balance calculation
    const dailyData = transactions.reduce((acc, transaction) => {
      const date = transaction.date;
      if (!acc[date]) {
        acc[date] = { date, income: 0, expenses: 0, balance: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expenses += transaction.amount;
      }
      
      return acc;
    }, {});

    // Calculate running balance
    let runningBalance = 50000; // Starting balance
    const sortedDates = Object.keys(dailyData).sort();
    
    sortedDates.forEach(date => {
      const day = dailyData[date];
      runningBalance += day.income - day.expenses;
      day.balance = runningBalance;
      day.netChange = day.income - day.expenses;
    });

    return Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  const weeklyData = useMemo(() => {
    // Early return if timeBasedData is empty
    if (!timeBasedData || timeBasedData.length === 0) {
      return [];
    }

    const weeks = {};
    
    timeBasedData.forEach(day => {
      const date = new Date(day.date);
      const weekNumber = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7);
      const weekKey = `Week ${weekNumber}`;
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = { week: weekKey, income: 0, expenses: 0, balance: 0 };
      }
      
      weeks[weekKey].income += day.income;
      weeks[weekKey].expenses += day.expenses;
      weeks[weekKey].balance += day.balance;
    });

    return Object.values(weeks);
  }, [timeBasedData]);

  const insights = useMemo(() => {
    // Early return if timeBasedData is empty
    if (!timeBasedData || timeBasedData.length === 0) {
      return {
        totalDays: 0,
        totalIncome: 0,
        totalExpenses: 0,
        netChange: 0,
        averageDailyExpense: 0,
        highestExpenseDay: null,
        lowestExpenseDay: null,
        expenseTrend: 'stable'
      };
    }

    const recentDays = timeBasedData.slice(-7);
    const previousDays = timeBasedData.slice(-14, -7);
    
    const recentExpenses = recentDays.reduce((sum, day) => sum + day.expenses, 0);
    const previousExpenses = previousDays.reduce((sum, day) => sum + day.expenses, 0);
    
    const expenseChange = previousExpenses > 0 ? ((recentExpenses - previousExpenses) / previousExpenses * 100) : 0;
    
    const currentBalance = timeBasedData.length > 0 ? timeBasedData[timeBasedData.length - 1].balance : 0;
    const previousBalance = timeBasedData.length > 7 ? timeBasedData[timeBasedData.length - 8].balance : 50000;
    const balanceChange = ((currentBalance - previousBalance) / previousBalance * 100);

    const monthlyIncome = monthlyData[monthlyData.length - 1]?.income || 0;
    const monthlyExpenses = monthlyData[monthlyData.length - 1]?.expenses || 0;
    const expensesCrossedIncome = monthlyExpenses > monthlyIncome;

    return {
      expenseTrend: expenseChange,
      balanceTrend: balanceChange,
      currentBalance,
      monthlyIncome,
      monthlyExpenses,
      expensesCrossedIncome,
      recentExpenses,
      previousExpenses
    };
  }, [timeBasedData, monthlyData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-black p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm dark:text-gray-300" style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value?.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const BalanceTrendCard = () => (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <span className="text-blue-700 font-medium">Balance Trend</span>
        </div>
        <div className={`flex items-center ${insights.balanceTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {insights.balanceTrend >= 0 ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          <span className="text-sm font-medium">
            {Math.abs(insights.balanceTrend).toFixed(1)}%
          </span>
        </div>
      </div>
      <p className="text-2xl font-bold text-blue-900">
        ₹{insights.currentBalance.toLocaleString('en-IN')}
      </p>
      <p className="text-sm text-blue-700 mt-1">Current balance</p>
    </div>
  );

  const ExpenseTrendCard = () => (
    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-red-600" />
          <span className="text-red-700 font-medium">7-Day Expense Trend</span>
        </div>
        <div className={`flex items-center ${insights.expenseTrend <= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {insights.expenseTrend <= 0 ? (
            <TrendingDown className="w-4 h-4 mr-1" />
          ) : (
            <TrendingUp className="w-4 h-4 mr-1" />
          )}
          <span className="text-sm font-medium">
            {Math.abs(insights.expenseTrend).toFixed(1)}%
          </span>
        </div>
      </div>
      <p className="text-2xl font-bold text-red-900">
        ₹{insights.recentExpenses.toLocaleString('en-IN')}
      </p>
      <p className="text-sm text-red-700 mt-1">Last 7 days</p>
    </div>
  );

  const IncomeExpenseCard = () => (
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-purple-600" />
          <span className="text-purple-700 font-medium">Income vs Expenses</span>
        </div>
        {insights.expensesCrossedIncome && (
          <AlertTriangle className="w-4 h-4 text-orange-600" />
        )}
      </div>
      <div className="space-y-1">
        <p className="text-lg font-bold text-purple-900">
          Income: ₹{insights.monthlyIncome.toLocaleString('en-IN')}
        </p>
        <p className="text-lg font-bold text-red-900">
          Expenses: ₹{insights.monthlyExpenses.toLocaleString('en-IN')}
        </p>
      </div>
      <p className="text-sm text-purple-700 mt-1">
        {insights.expensesCrossedIncome ? '⚠️ Expenses crossed income!' : 'Healthy balance'}
      </p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-black rounded-xl p-6 card-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <Activity className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Time-Based Analysis</h3>
      </div>

      {/* Show message if no data */}
      {(!transactions || transactions.length === 0) && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No transaction data available for time analysis</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add some transactions to see time-based trends</p>
        </div>
      )}

      {/* Show charts if data exists */}
      {transactions && transactions.length > 0 && (
        <>
          {/* Trend Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <BalanceTrendCard />
            <ExpenseTrendCard />
        <IncomeExpenseCard />
      </div>

      {/* Daily Balance Trend */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Daily Balance Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeBasedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#6366f1" 
              fill="#6366f1" 
              fillOpacity={0.3}
              strokeWidth={2}
              name="Balance"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Income vs Expenses Over Time */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Income vs Expenses Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeBasedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 3 }}
              name="Income"
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 3 }}
              name="Expenses"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Comparison */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Weekly Comparison</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Weekly Income"
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Weekly Expenses"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insights */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Key Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <TrendingUp className={`w-5 h-5 mt-0.5 ${insights.balanceTrend >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            <div>
              <p className="font-medium text-gray-900">Balance Trend</p>
              <p className="text-sm text-gray-600">
                Your balance has {insights.balanceTrend >= 0 ? 'increased' : 'decreased'} by {Math.abs(insights.balanceTrend).toFixed(1)}% over the last week
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Calendar className={`w-5 h-5 mt-0.5 ${insights.expenseTrend <= 0 ? 'text-green-600' : 'text-red-600'}`} />
            <div>
              <p className="font-medium text-gray-900">Spending Pattern</p>
              <p className="text-sm text-gray-600">
                {insights.expenseTrend > 0 ? 'Spending increased' : 'Spending decreased'} by {Math.abs(insights.expenseTrend).toFixed(1)}% compared to previous week
              </p>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default TimeBasedVisualization;
