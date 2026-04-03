import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Brain, Clock, TrendingUp, AlertCircle, BarChart3, Target } from 'lucide-react';

const CategoryTimeAnalysis = ({ transactions }) => {
  const categoryTimeData = useMemo(() => {
    const categoryDailyData = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = transaction.category;
        const date = transaction.date;
        
        if (!categoryDailyData[category]) {
          categoryDailyData[category] = {};
        }
        
        if (!categoryDailyData[category][date]) {
          categoryDailyData[category][date] = 0;
        }
        
        categoryDailyData[category][date] += transaction.amount;
      });

    // Get all unique dates and sort them
    const allDates = [...new Set(transactions.map(t => t.date))].sort();
    
    // Create time series data for each category
    const timeSeriesData = allDates.map(date => {
      const dataPoint = { date };
      
      Object.keys(categoryDailyData).forEach(category => {
        dataPoint[category] = categoryDailyData[category][date] || 0;
      });
      
      return dataPoint;
    });

    const categoryTotals = Object.entries(categoryDailyData).reduce((acc, [category, dailyData]) => {
      acc[category] = Object.values(dailyData).reduce((sum, amount) => sum + amount, 0);
      return acc;
    }, {});

    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category]) => category);

    return { timeSeriesData, topCategories, categoryTotals };
  }, [transactions]);

  const weeklyCategoryData = useMemo(() => {
    const weeklyData = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const date = new Date(transaction.date);
        const weekNumber = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7);
        const weekKey = `Week ${weekNumber}`;
        const category = transaction.category;
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {};
        }
        
        if (!weeklyData[weekKey][category]) {
          weeklyData[weekKey][category] = 0;
        }
        
        weeklyData[weekKey][category] += transaction.amount;
      });

    const weeks = Object.keys(weeklyData).sort();
    return weeks.map(week => {
      const dataPoint = { week };
      categoryTimeData.topCategories.forEach(category => {
        dataPoint[category] = weeklyData[week][category] || 0;
      });
      return dataPoint;
    });
  }, [transactions, categoryTimeData.topCategories]);

  const insights = useMemo(() => {
    const { timeSeriesData, topCategories, categoryTotals } = categoryTimeData;
    
    if (timeSeriesData.length < 2) return { trends: {}, insights: [] };

    const trends = {};
    const insights = [];

    topCategories.forEach(category => {
      const recentAmount = timeSeriesData.slice(-3).reduce((sum, day) => sum + (day[category] || 0), 0);
      const previousAmount = timeSeriesData.slice(-6, -3).reduce((sum, day) => sum + (day[category] || 0), 0);
      
      const trend = previousAmount > 0 ? ((recentAmount - previousAmount) / previousAmount * 100) : 0;
      trends[category] = trend;

      if (Math.abs(trend) > 20) {
        insights.push({
          category,
          trend,
          type: trend > 0 ? 'warning' : 'success',
          message: `${category} spending has ${trend > 0 ? 'increased' : 'decreased'} by ${Math.abs(trend).toFixed(1)}% recently`
        });
      }
    });

    const volatilities = topCategories.map(category => {
      const amounts = timeSeriesData.map(day => day[category] || 0);
      const mean = amounts.length > 0 ? amounts.reduce((sum, val) => sum + val, 0) / amounts.length : 0;
      const variance = amounts.length > 0 ? amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length : 0;
      const stdDev = Math.sqrt(variance);
      return { category, volatility: mean > 0 ? stdDev / mean : 0 };
    }).sort((a, b) => b.volatility - a.volatility);

    return { trends, insights, mostVolatile: volatilities[0]?.category, categoryTotals };
  }, [categoryTimeData]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value?.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const TrendCard = ({ category, trend, amount }) => {
    const isPositive = trend > 0;
    const safeAmount = amount || 0;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-900">{category}</span>
          <div className={`flex items-center ${isPositive ? 'text-red-600' : 'text-green-600'}`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        </div>
        <p className="text-lg font-bold text-gray-900">
          ₹{safeAmount.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-gray-600">Total spending</p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 card-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">Category Over Time Analysis</h3>
        <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">Advanced</span>
      </div>

      {/* Category Trend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {categoryTimeData.topCategories.map((category) => (
          <TrendCard
            key={category}
            category={category}
            trend={insights.trends[category] || 0}
            amount={insights.categoryTotals[category] || 0}
          />
        ))}
      </div>

      {/* Daily Category Trends */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Daily Spending Trends by Category</h4>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={categoryTimeData.timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {categoryTimeData.topCategories.map((category, index) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ fill: COLORS[index % COLORS.length], r: 3 }}
                name={category}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Category Comparison */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Weekly Category Comparison</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={weeklyCategoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {categoryTimeData.topCategories.map((category, index) => (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                stackId="1"
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.6}
                name={category}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category Insights */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Dynamic Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.insights.map((insight, index) => {
            const Icon = insight.type === 'warning' ? AlertCircle : Target;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`w-5 h-5 mt-0.5 ${
                    insight.type === 'warning' ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                  <div>
                    <h5 className={`font-semibold ${
                      insight.type === 'warning' ? 'text-yellow-900' : 'text-green-900'
                    }`}>
                      {insight.category} Trend Alert
                    </h5>
                    <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Volatility Analysis */}
      {insights.mostVolatile && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <BarChart3 className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h5 className="font-semibold text-purple-900">Most Volatile Category</h5>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-medium">{insights.mostVolatile}</span> shows the most spending variation over time. 
                Consider setting a budget limit for this category.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Takeaways */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Key Takeaways</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Time Patterns</p>
              <p className="text-sm text-gray-600">
                Track how each category changes over time to identify spending patterns
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Trend Analysis</p>
              <p className="text-sm text-gray-600">
                Monitor increasing or decreasing trends in each spending category
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Target className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Budget Planning</p>
              <p className="text-sm text-gray-600">
                Use historical data to set realistic category budgets
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTimeAnalysis;
