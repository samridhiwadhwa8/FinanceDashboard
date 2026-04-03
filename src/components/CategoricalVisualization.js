import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Treemap } from 'recharts';
import { BarChart3, Layers, Target, AlertCircle, TrendingUp } from 'lucide-react';

const CategoricalVisualization = ({ transactions }) => {
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = expenses.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: ((amount / total) * 100).toFixed(1),
      transactions: expenses.filter(t => t.category === category).length,
      average: Math.round(amount / expenses.filter(t => t.category === category).length)
    })).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const incomeData = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income');
    const incomeTotals = income.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

    return Object.entries(incomeTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: ((amount / income.reduce((sum, t) => sum + t.amount, 0)) * 100).toFixed(1)
    })).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const comparisonData = useMemo(() => {
    const expenseCategories = categoryData.reduce((acc, cat) => {
      acc[cat.category] = { expense: cat.amount };
      return acc;
    }, {});

    const incomeCategories = incomeData.reduce((acc, cat) => {
      if (!acc[cat.category]) acc[cat.category] = { expense: 0 };
      acc[cat.category].income = cat.amount;
      return acc;
    }, expenseCategories);

    return Object.entries(incomeCategories).map(([category, data]) => ({
      category,
      income: data.income || 0,
      expense: data.expense || 0,
      net: (data.income || 0) - data.expense
    })).filter(item => item.income > 0 || item.expense > 0);
  }, [categoryData]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#f97316', '#84cc16', '#a855f7'];

  const treemapData = useMemo(() => {
    return categoryData.map((cat, index) => ({
      name: cat.category || 'Unknown',
      size: cat.amount || 0,
      fill: COLORS[index % COLORS.length]
    }));
  }, [categoryData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-black p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm dark:text-gray-300" style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value?.toLocaleString('en-IN')}
              {entry.payload?.percentage && ` (${entry.payload.percentage}%)`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const TreemapTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-black p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{data.name || 'Unknown'}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">₹{(data.size || 0).toLocaleString('en-IN')}</p>
        </div>
      );
    }
    return null;
  };

  const insights = useMemo(() => {
    const topCategory = categoryData[0];
    const totalExpenses = categoryData.reduce((sum, cat) => sum + cat.amount, 0);
    const topCategoryPercentage = ((topCategory?.amount || 0) / totalExpenses * 100).toFixed(1);
    
    return {
      topCategory: topCategory?.category || 'N/A',
      topCategoryAmount: topCategory?.amount || 0,
      topCategoryPercentage,
      totalCategories: categoryData.length,
      averageCategorySpending: Math.round(totalExpenses / categoryData.length)
    };
  }, [categoryData]);

  const SpendingInsightCard = () => (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-2">
        <Target className="w-4 h-4 text-orange-600" />
        <span className="text-orange-700 font-medium">Top Spending Category</span>
      </div>
      <p className="text-2xl font-bold text-orange-900">{insights.topCategory}</p>
      <p className="text-sm text-orange-700 mt-1">
        ₹{insights.topCategoryAmount.toLocaleString('en-IN')} ({insights.topCategoryPercentage}%)
      </p>
    </div>
  );

  const CategoryCountCard = () => (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-2">
        <Layers className="w-4 h-4 text-blue-600" />
        <span className="text-blue-700 font-medium">Active Categories</span>
      </div>
      <p className="text-2xl font-bold text-blue-900">{insights.totalCategories}</p>
      <p className="text-sm text-blue-700 mt-1">
        Avg: ₹{insights.averageCategorySpending.toLocaleString('en-IN')}/category
      </p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-black rounded-xl p-6 card-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Categorical Analysis</h3>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <SpendingInsightCard />
        <CategoryCountCard />
      </div>

      {/* Pie Chart and Bar Chart Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Spending Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category}: ${percentage}%`}
                outerRadius={100}
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

        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Category Comparison</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#6366f1" radius={[0, 4, 4, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

     

      {/* Income vs Expenses by Category */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Income vs Expenses by Category</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" />
            <Bar dataKey="expense" fill="#ef4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Category Table */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Percentage</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Transactions</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Average</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((category, index) => (
                <tr key={category.category} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium text-gray-900">{category.category}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">
                    ₹{category.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {category.percentage}%
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {category.transactions}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    ₹{category.average.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Category Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Highest Spending</p>
              <p className="text-sm text-gray-600">
                Most money spent on {insights.topCategory} ({insights.topCategoryPercentage}% of total expenses)
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Diversification</p>
              <p className="text-sm text-gray-600">
                Spending spread across {insights.totalCategories} categories with an average of ₹{insights.averageCategorySpending.toLocaleString('en-IN')} per category
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoricalVisualization;
