import React, { useState, createContext, useContext } from 'react';
import { Shield, Eye, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const RoleContext = createContext();

const RoleBasedUI = ({ children }) => {
  const { state, actions } = useAppContext();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const value = {
    role: state.role,
    setRole: actions.setRole,
    isAdmin: state.role === 'admin',
    isViewer: state.role === 'viewer'
  };

  return (
    <RoleContext.Provider value={value}>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Main content area */}
        <div className="flex-1">
          {children}
        </div>

        {/* Role Selector at Bottom */}
        <div className="fixed bottom-4 left-4 z-50">
          <AnimatePresence>
            {showRoleSwitcher && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-1 min-w-48 mb-2"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Select Role</h3>
                  <button
                    onClick={() => setShowRoleSwitcher(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { actions.setRole('viewer'); setShowRoleSwitcher(false); }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      state.role === 'viewer' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">Viewer</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { actions.setRole('admin'); setShowRoleSwitcher(false); }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      state.role === 'admin' 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Admin</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Role Button */}
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Role: {state.role === 'admin' ? 'Admin' : 'Viewer'}
            </span>
          </button>
        </div>

        {/* Floating Role Indicator - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="fixed bottom-4 right-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-40"
        >
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: state.role === 'admin' ? 360 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {state.role === 'admin' ? (
                <Shield className="w-5 h-5 text-purple-600" />
              ) : (
                <Eye className="w-5 h-5 text-blue-600" />
              )}
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {state.role === 'admin' ? 'Admin Mode' : 'Viewer Mode'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {state.role === 'admin' ? 'Full access' : 'Read-only access'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleBasedUI');
  }
  return context;
};

export const RoleButton = ({ children, adminOnly, viewerOnly, className = '', ...props }) => {
  const { isAdmin, isViewer } = useRole();

  // Check if button should be visible
  if (adminOnly && !isAdmin) return null;
  if (viewerOnly && !isViewer) return null;

  // Determine disabled state
  const isDisabled = adminOnly && !isAdmin;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`${className} ${
        isDisabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:opacity-90 transition-opacity'
      }`}
    >
      {children}
    </button>
  );
};

export const RoleProtectedAction = ({ adminOnly, children, fallback = null }) => {
  const { isAdmin } = useRole();

  if (adminOnly && !isAdmin) {
    return fallback;
  }

  return children;
};

export default RoleBasedUI;
