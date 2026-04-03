import React, { useMemo } from 'react';
import AnimatedFinancialSummary from './AnimatedFinancialSummary';
import Transactions from './Transactions';
import SpendingInsights from './SpendingInsights';
import SpendingBreakdown from './SpendingBreakdown';
import SmartAlerts from './SmartAlerts';
import AIPredictions from './AIPredictions';
import TimeBasedVisualization from './TimeBasedVisualization';
import CategoricalVisualization from './CategoricalVisualization';
import CategoryTimeAnalysis from './CategoryTimeAnalysis';
import SmartInsights from './SmartInsights';
import ThemeToggle from './ThemeToggle';
import ExportData from './ExportData';
import { useAppContext } from '../context/AppContext';
import { monthlyData } from '../data/mockData';
import { BarChart3, Wallet, Receipt, TrendingUp, Bell, Brain, PieChart, Activity, BarChart3 as CategoryIcon, Clock, Lightbulb } from 'lucide-react';

const AppContent = () => {
  const { state, actions, filteredTransactions, financialData, isAdmin, isViewer } = useAppContext();
  
  const trends = {
    balance: 12.5,
    income: 8.3,
    expenses: -5.2,
    savings: 15.7
  };

  const tabs = [
    { id: 'summary', name: 'Financial Summary', icon: Wallet },
    { id: 'transactions', name: 'Transactions', icon: Receipt },
    { id: 'smart-insights', name: 'Smart Insights', icon: Lightbulb },
    { id: 'time-based', name: 'Time Analysis', icon: Activity },
    { id: 'categorical', name: 'Category Analysis', icon: CategoryIcon },
    { id: 'category-time', name: 'Category Over Time', icon: Clock },
    { id: 'breakdown', name: 'Spending Breakdown', icon: PieChart },
    { id: 'insights', name: 'Spending Insights', icon: TrendingUp },
    { id: 'alerts', name: 'Smart Alerts', icon: Bell },
    { id: 'predictions', name: 'AI Predictions', icon: Brain }
  ];

  return (
    <>
      <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              {tabs.map((tab) => {
                return (
                  <button
                    key={tab.id}
                    onClick={() => actions.setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                      state.activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <ExportData />
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full bg-gray-50 dark:bg-black">
        {state.activeTab === 'summary' && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Financial Overview</h2>
              <p className="text-gray-600 dark:text-gray-400">Track your income, expenses, and savings at a glance</p>
            </div>
            <AnimatedFinancialSummary
              totalBalance={financialData.totalBalance}
              totalIncome={financialData.totalIncome}
              totalExpenses={financialData.totalExpenses}
              netSavings={financialData.netSavings}
              trends={{
                balance: 12.5,
                income: 8.3,
                expenses: -5.2,
                savings: 15.7
              }}
            />
            <div className="mt-8">
              <SpendingInsights transactions={state.transactions} monthlyData={monthlyData} />
            </div>
          </div>
        )}

        {state.activeTab === 'transactions' && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Transaction Management</h2>
              <p className="text-gray-600 dark:text-gray-400">View, add, edit, and manage your financial transactions</p>
            </div>
            <Transactions />
          </div>
        )}

        {state.activeTab === 'smart-insights' && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Smart Insights</h2>
              <p className="text-gray-600 dark:text-gray-400">AI-powered analysis of your spending patterns</p>
            </div>
            <SmartInsights transactions={state.transactions} />
          </div>
        )}

        {state.activeTab === 'time-based' && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Time-Based Analysis</h2>
              <p className="text-gray-600 dark:text-gray-400">Track your financial trends over time</p>
            </div>
            <TimeBasedVisualization transactions={state.transactions} />
          </div>
        )}

        {state.activeTab === 'categorical' && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Category Analysis</h2>
              <p className="text-gray-600 dark:text-gray-400">Break down your spending by category</p>
            </div>
            <CategoricalVisualization transactions={state.transactions} />
          </div>
        )}

        {state.activeTab === 'category-time' && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Category Over Time</h2>
              <p className="text-gray-600 dark:text-gray-400">Analyze category trends throughout the year</p>
            </div>
            <CategoryTimeAnalysis transactions={state.transactions} />
          </div>
        )}

        {state.activeTab === 'breakdown' && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Spending Breakdown</h2>
              <p className="text-gray-600 dark:text-gray-400">Detailed analysis of your spending patterns</p>
            </div>
            <SpendingBreakdown transactions={state.transactions} />
          </div>
        )}

        {state.activeTab === 'insights' && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Spending Insights</h2>
              <p className="text-gray-600 dark:text-gray-400">Deep insights into your financial habits</p>
            </div>
            <SpendingInsights transactions={state.transactions} monthlyData={monthlyData} />
          </div>
        )}

        {state.activeTab === 'alerts' && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Smart Alerts</h2>
              <p className="text-gray-600 dark:text-gray-400">Stay informed about important financial events</p>
            </div>
            <SmartAlerts transactions={state.transactions} />
          </div>
        )}

        {state.activeTab === 'predictions' && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">AI Predictions</h2>
              <p className="text-gray-600 dark:text-gray-400">Forecast your financial future with machine learning insights</p>
            </div>
            <AIPredictions transactions={state.transactions} monthlyData={monthlyData} />
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Financial Dashboard 2026</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AppContent;
