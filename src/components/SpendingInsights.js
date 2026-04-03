import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, Brain, Target } from 'lucide-react';

const SpendingInsights = ({ transactions, monthlyData }) => {
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = expenses.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: ((amount / expenses.reduce((sum, t) => sum + t.amount, 0)) * 100).toFixed(1)
    })).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const topExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  const insights = useMemo(() => {
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1);
    
    return [
      {
        icon: AlertTriangle,
        title: 'High Spending Alert',
        description: `You spent ₹${totalExpenses.toLocaleString('en-IN')} this month, which is ${totalExpenses > totalIncome * 0.7 ? 'high' : 'moderate'} compared to your income.`,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      },
      {
        icon: Target,
        title: 'Savings Rate',
        description: `Your current savings rate is ${savingsRate}%. ${savingsRate < 20 ? 'Consider reducing expenses to improve savings.' : 'Great job saving!'}`,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        icon: TrendingUp,
        title: 'Top Category',
        description: `${categoryData[0]?.category || 'N/A'} is your highest expense category at ₹${categoryData[0]?.amount.toLocaleString('en-IN') || 0}.`,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      {
        icon: Brain,
        title: 'AI Suggestion',
        description: categoryData[0]?.percentage > 40 
          ? `Consider reducing ${categoryData[0]?.category} expenses by 20% to save ₹${Math.round(categoryData[0]?.amount * 0.2).toLocaleString('en-IN')} monthly.`
          : 'Your spending is well-balanced across categories.',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      }
    ];
  }, [transactions, categoryData]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#f97316'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">₹{payload[0].value.toLocaleString('en-IN')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Category-wise Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top Expenses</h3>
          <div className="space-y-3">
            {topExpenses.map((expense, index) => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    <p className="text-sm text-gray-600">{expense.category} • {expense.date}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-red-600">
                  ₹{expense.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-4">AI Insights & Suggestions</h3>
          <div className="space-y-3">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className={`${insight.bgColor} p-4 rounded-lg`}>
                  <div className="flex items-start space-x-3">
                    <Icon className={`w-5 h-5 ${insight.color} mt-0.5`} />
                    <div>
                      <h4 className={`font-semibold ${insight.color}`}>{insight.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingInsights;
