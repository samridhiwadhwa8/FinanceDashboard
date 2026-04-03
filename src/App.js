import React from 'react';
import RoleBasedUI from './components/RoleBasedUI';
import { AppProvider } from './context/AppContext';
import { mockTransactions } from './data/mockData';
import { BarChart3 } from 'lucide-react';
import AppContent from './components/AppContent';

const AppInitializer = () => {
  return (
    <AppProvider initialValue={{ transactions: mockTransactions }}>
      <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
        <RoleBasedUI>
          <header className="bg-white dark:bg-black shadow-sm border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Z</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Zorvyn Finance Hub</h1>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: {new Date().toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>
          </header>

          <AppContent />
        </RoleBasedUI>
      </div>
    </AppProvider>
  );
};

export default AppInitializer;
