import React, { useMemo, useState } from 'react';
import { Bell, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Calendar, X, Check } from 'lucide-react';

const SmartAlerts = ({ transactions, monthlyData }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  const alerts = useMemo(() => {
    const currentMonth = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const currentDate = new Date();
      return transactionDate.getMonth() === currentDate.getMonth() && 
             transactionDate.getFullYear() === currentDate.getFullYear();
    });

    const totalExpenses = currentMonth.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = currentMonth.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

    const categoryExpenses = currentMonth
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const topCategory = Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1])[0];

    const newAlerts = [];

    // High spending alert
    if (totalExpenses > totalIncome * 0.8) {
      newAlerts.push({
        id: 'high-spending',
        type: 'danger',
        icon: AlertTriangle,
        title: 'High Spending Alert',
        message: `You've spent ₹${totalExpenses.toLocaleString('en-IN')} this month, which is ${((totalExpenses / totalIncome) * 100).toFixed(1)}% of your income.`,
        action: 'Review expenses'
      });
    }

    // Low savings alert
    if (savingsRate < 20) {
      newAlerts.push({
        id: 'low-savings',
        type: 'warning',
        icon: TrendingDown,
        title: 'Low Savings Rate',
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Consider aiming for at least 20%.`,
        action: 'Set savings goal'
      });
    }

    // Category overspending
    if (topCategory && topCategory[1] > totalIncome * 0.3) {
      newAlerts.push({
        id: 'category-overspend',
        type: 'warning',
        icon: DollarSign,
        title: 'High Category Spending',
        message: `${topCategory[0]} expenses are ₹${topCategory[1].toLocaleString('en-IN')}, which is ${((topCategory[1] / totalIncome) * 100).toFixed(1)}% of your income.`,
        action: 'Set category budget'
      });
    }

    // Positive savings milestone
    if (savingsRate >= 30) {
      newAlerts.push({
        id: 'good-savings',
        type: 'success',
        icon: TrendingUp,
        title: 'Great Savings!',
        message: `Excellent! You're saving ${savingsRate.toFixed(1)}% of your income this month.`,
        action: 'Keep it up!'
      });
    }

    // Unusual spending pattern (if daily average > 2x monthly average)
    const dailyAvg = totalExpenses / 30;
    const recentTransactions = currentMonth.filter(t => {
      const transactionDate = new Date(t.date);
      const daysAgo = Math.floor((new Date() - transactionDate) / (1000 * 60 * 60 * 24));
      return daysAgo <= 3 && t.type === 'expense';
    });

    const recentAvg = recentTransactions.length > 0 ? 
      recentTransactions.reduce((sum, t) => sum + t.amount, 0) / recentTransactions.length : 0;

    if (recentAvg > dailyAvg * 2) {
      newAlerts.push({
        id: 'unusual-spending',
        type: 'info',
        icon: Calendar,
        title: 'Unusual Spending Pattern',
        message: 'Your recent spending is higher than usual. Consider reviewing recent transactions.',
        action: 'Review recent'
      });
    }

    return newAlerts;
  }, [transactions]);

  const activeAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const acknowledgeAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const getAlertStyles = (type) => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          title: 'text-red-900',
          message: 'text-red-700',
          button: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-600',
          title: 'text-yellow-900',
          message: 'text-yellow-700',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: 'text-green-600',
          title: 'text-green-900',
          message: 'text-green-700',
          button: 'bg-green-600 hover:bg-green-700'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          title: 'text-blue-900',
          message: 'text-blue-700',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-600',
          title: 'text-gray-900',
          message: 'text-gray-700',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 card-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 text-gray-700" />
          <h3 className="text-xl font-bold text-gray-900">Smart Alerts</h3>
          {activeAlerts.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {activeAlerts.length}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-600">
          {activeAlerts.length} active alert{activeAlerts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {activeAlerts.length === 0 ? (
        <div className="text-center py-12">
          <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h4>
          <p className="text-gray-600">No alerts at the moment. Your finances look healthy.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeAlerts.map((alert) => {
            const Icon = alert.icon;
            const styles = getAlertStyles(alert.type);
            
            return (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 ${styles.bg} transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon className={`w-5 h-5 ${styles.icon} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${styles.title}`}>{alert.title}</h4>
                      <p className={`text-sm mt-1 ${styles.message}`}>{alert.message}</p>
                      <button
                        className={`mt-3 text-sm font-medium px-3 py-1 rounded-md text-white ${styles.button} transition-colors`}
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        {alert.action}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className={`ml-4 ${styles.icon} hover:opacity-70 transition-opacity`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {dismissedAlerts.size > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => setDismissedAlerts(new Set())}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Show {dismissedAlerts.size} dismissed alert{dismissedAlerts.size !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartAlerts;
