import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, TrendingUp, AlertCircle, Target, Zap } from 'lucide-react';

const AIPredictions = ({ transactions, monthlyData }) => {
  const predictions = useMemo(() => {
    // Simple linear regression for prediction
    const predictNextMonth = (data, key) => {
      if (data.length < 2) return data[data.length - 1]?.[key] || 0;
      
      const n = data.length;
      const sumX = (n * (n - 1)) / 2;
      const sumY = data.reduce((sum, d) => sum + d[key], 0);
      const sumXY = data.reduce((sum, d, i) => sum + i * d[key], 0);
      const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      return Math.max(0, slope * n + intercept);
    };

    const predictedIncome = predictNextMonth(monthlyData, 'income');
    const predictedExpenses = predictNextMonth(monthlyData, 'expenses');
    const predictedSavings = predictedIncome - predictedExpenses;

    // Category-wise predictions
    const categoryExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const totalExpenses = Object.values(categoryExpenses).reduce((sum, amount) => sum + amount, 0);
    
    const categoryPredictions = Object.entries(categoryExpenses).map(([category, amount]) => ({
      category,
      current: amount,
      predicted: Math.round(amount * (predictedExpenses / totalExpenses)),
      trend: amount > totalExpenses * 0.3 ? 'high' : amount > totalExpenses * 0.15 ? 'medium' : 'low'
    })).sort((a, b) => b.predicted - a.predicted);

    // Spending patterns analysis
    const dailySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const day = new Date(t.date).getDate();
        acc[day] = (acc[day] || 0) + t.amount;
        return acc;
      }, {});

    const avgDailySpending = Object.values(dailySpending).reduce((sum, amount) => sum + amount, 0) / Object.keys(dailySpending).length;

    const monthlyProjection = [
      ...monthlyData.map((month, index) => ({
        ...month,
        projectedIncome: null,
        projectedExpenses: null,
        projectedSavings: null,
      })),
      {
        month: 'May',
        income: null,
        expenses: null,
        projectedIncome: predictedIncome,
        projectedExpenses: predictedExpenses,
        projectedSavings: predictedSavings,
      }
    ];

    return {
      predictedIncome,
      predictedExpenses,
      predictedSavings,
      savingsRate: predictedIncome > 0 ? (predictedSavings / predictedIncome * 100) : 0,
      categoryPredictions,
      avgDailySpending,
      monthlyProjection
    };
  }, [transactions, monthlyData]);

  const insights = useMemo(() => {
    const insights = [];
    
    if (predictions.predictedSavings < 0) {
      insights.push({
        type: 'danger',
        icon: AlertCircle,
        title: 'Negative Savings Predicted',
        message: `Based on current trends, you may overspend by ₹${Math.abs(predictions.predictedSavings).toLocaleString('en-IN')} next month.`,
        recommendation: 'Consider reducing expenses or increasing income.'
      });
    } else if (predictions.savingsRate < 20) {
      insights.push({
        type: 'warning',
        icon: TrendingUp,
        title: 'Low Savings Rate',
        message: `Predicted savings rate is ${predictions.savingsRate.toFixed(1)}%, below the recommended 20%.`,
        recommendation: `Try to reduce expenses by ₹${Math.round(predictions.predictedExpenses * 0.1).toLocaleString('en-IN')} to improve savings.`
      });
    } else {
      insights.push({
        type: 'success',
        icon: Target,
        title: 'Healthy Financial Outlook',
        message: `Great! You are on track to save ₹${predictions.predictedSavings.toLocaleString('en-IN')} next month.`,
        recommendation: 'Consider investing your savings for better returns.'
      });
    }

    const highSpendingCategory = predictions.categoryPredictions.find(cat => cat.trend === 'high');
    if (highSpendingCategory) {
      insights.push({
        type: 'info',
        icon: Zap,
        title: 'Category Spending Alert',
        message: `${highSpendingCategory.category} may reach ₹${highSpendingCategory.predicted.toLocaleString('en-IN')} next month.`,
        recommendation: `Set a budget limit of ₹${Math.round(highSpendingCategory.current * 0.8).toLocaleString('en-IN')} for this category.`
      });
    }

    return insights;
  }, [predictions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
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

  return (
    <div className="bg-white rounded-xl p-6 card-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">AI Predictions & Forecast</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-700 font-medium">Predicted Income</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">
            ₹{predictions.predictedIncome.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-blue-700 mt-1">Next month estimate</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-700 font-medium">Predicted Expenses</span>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-900">
            ₹{predictions.predictedExpenses.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-red-700 mt-1">Based on trends</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-700 font-medium">Predicted Savings</span>
            <Target className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">
            ₹{predictions.predictedSavings.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-green-700 mt-1">{predictions.savingsRate.toFixed(1)}% savings rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Monthly Projection</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={predictions.monthlyProjection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
              <Line 
                type="monotone" 
                dataKey="projectedIncome" 
                stroke="#10b981" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                name="Projected Income" 
              />
              <Line 
                type="monotone" 
                dataKey="projectedExpenses" 
                stroke="#ef4444" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                name="Projected Expenses" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Category Predictions</h4>
          <div className="space-y-3">
            {predictions.categoryPredictions.slice(0, 5).map((category) => (
              <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{category.category}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      category.trend === 'high' ? 'bg-red-100 text-red-700' :
                      category.trend === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {category.trend}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">Current: ₹{category.current.toLocaleString('en-IN')}</span>
                    <span className="text-gray-900 font-medium">→</span>
                    <span className="text-gray-900">Predicted: ₹{category.predicted.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">AI Insights & Recommendations</h4>
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.type === 'danger' ? 'bg-red-50 border-red-200' :
                  insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  insight.type === 'success' ? 'bg-green-50 border-green-200' :
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`w-5 h-5 mt-0.5 ${
                    insight.type === 'danger' ? 'text-red-600' :
                    insight.type === 'warning' ? 'text-yellow-600' :
                    insight.type === 'success' ? 'text-green-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <h5 className={`font-semibold ${
                      insight.type === 'danger' ? 'text-red-900' :
                      insight.type === 'warning' ? 'text-yellow-900' :
                      insight.type === 'success' ? 'text-green-900' :
                      'text-blue-900'
                    }`}>
                      {insight.title}
                    </h5>
                    <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
                    <p className="text-sm font-medium text-gray-900 mt-2">
                      💡 {insight.recommendation}
                    </p>
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

export default AIPredictions;
