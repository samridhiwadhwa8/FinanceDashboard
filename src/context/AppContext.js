import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';

// Initial state
const initialState = {
  // Transactions state
  transactions: [],
  filters: {
    searchTerm: '',
    categoryFilter: 'all',
    typeFilter: 'all',
    dateRange: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  },
  // UI state
  role: 'viewer',
  activeTab: 'summary',
  theme: 'light', // Default to light
  // Computed data cache
  financialData: {
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0
  }
};

// Action types
const ACTION_TYPES = {
  // Transaction actions
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  
  // Filter actions
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  UPDATE_FILTER: 'UPDATE_FILTER',
  RESET_FILTERS: 'RESET_FILTERS',
  
  // UI actions
  SET_ROLE: 'SET_ROLE',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_THEME: 'SET_THEME',
  
  // Data actions
  UPDATE_FINANCIAL_DATA: 'UPDATE_FINANCIAL_DATA'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload
      };
    case ACTION_TYPES.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };
    case ACTION_TYPES.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id
            ? { ...transaction, ...action.payload.updates }
            : transaction
        )
      };
    case ACTION_TYPES.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    case ACTION_TYPES.UPDATE_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    case ACTION_TYPES.UPDATE_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value
        }
      };
    case ACTION_TYPES.RESET_FILTERS:
      return {
        ...state,
        filters: {
          searchTerm: '',
          categoryFilter: 'all',
          typeFilter: 'all',
          dateRange: 'all',
          sortBy: 'date',
          sortOrder: 'desc'
        }
      };
    case ACTION_TYPES.SET_ROLE:
      return {
        ...state,
        role: action.payload
      };
    case ACTION_TYPES.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload
      };
    case ACTION_TYPES.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
    case ACTION_TYPES.UPDATE_FINANCIAL_DATA:
      return {
        ...state,
        financialData: { ...state.financialData, ...action.payload }
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children, initialValue = {} }) => {
  const [state, dispatch] = useReducer(appReducer, { ...initialState, ...initialValue });

  // Load data from localStorage on mount
  useEffect(() => {
    // Load transactions
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        const parsedTransactions = JSON.parse(savedTransactions);
        dispatch({ type: ACTION_TYPES.SET_TRANSACTIONS, payload: parsedTransactions });
      } catch (error) {
        console.error('Error loading transactions from localStorage:', error);
      }
    }

    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch({ type: ACTION_TYPES.SET_THEME, payload: savedTheme });
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (state.transactions.length > 0) {
      localStorage.setItem('transactions', JSON.stringify(state.transactions));
    }
  }, [state.transactions]);

  // Apply theme to document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      // Also add to root element for maximum coverage
      document.getElementById('root')?.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.getElementById('root')?.classList.remove('dark');
    }
  }, [state.theme]);

  // Computed values (memoized for performance)
  const computedValues = useMemo(() => {
    // Filter transactions based on current filters
    const filteredTransactions = state.transactions.filter(transaction => {
      const matchesSearch = state.filters.searchTerm === '' || 
        transaction.description.toLowerCase().includes(state.filters.searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(state.filters.searchTerm.toLowerCase());
      
      const matchesCategory = state.filters.categoryFilter === 'all' || 
        transaction.category === state.filters.categoryFilter;
      
      const matchesType = state.filters.typeFilter === 'all' || 
        transaction.type === state.filters.typeFilter;
      
      const matchesDate = !state.filters.dateFilter || 
        transaction.date === state.filters.dateFilter;
      
      return matchesSearch && matchesCategory && matchesType && matchesDate;
    });

    // Apply sorting
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      let aValue, bValue;
      
      switch (state.filters.sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'date':
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }
      
      if (state.filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Calculate financial data from transactions
    const totalIncome = state.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalBalance = totalIncome - totalExpenses;
    const netSavings = totalBalance;

    return {
      filteredTransactions: sortedTransactions,
      financialData: {
        totalBalance,
        totalIncome,
        totalExpenses,
        netSavings
      },
      isAdmin: state.role === 'admin',
      isViewer: state.role === 'viewer'
    };
  }, [state.transactions, state.filters, state.role]);

  // Action creators
  const actions = useMemo(() => ({
    // Transaction actions
    addTransaction: (transaction) => {
      dispatch({ type: ACTION_TYPES.ADD_TRANSACTION, payload: transaction });
    },
    
    deleteTransaction: (id) => {
      dispatch({ type: ACTION_TYPES.DELETE_TRANSACTION, payload: id });
    },
    
    updateTransaction: (id, data) => {
      dispatch({ type: ACTION_TYPES.UPDATE_TRANSACTION, payload: { id, data } });
    },
    
    setTransactions: (transactions) => {
      dispatch({ type: ACTION_TYPES.SET_TRANSACTIONS, payload: transactions });
    },
    
    // Filter actions
    setFilters: (filters) => {
      dispatch({ type: ACTION_TYPES.SET_FILTERS, payload: filters });
    },
    
    updateFilter: (key, value) => {
      dispatch({ type: ACTION_TYPES.UPDATE_FILTER, payload: { key, value } });
    },
    
    resetFilters: () => {
      dispatch({ type: ACTION_TYPES.RESET_FILTERS });
    },
    
    // UI actions
    setRole: (role) => {
      dispatch({ type: ACTION_TYPES.SET_ROLE, payload: role });
    },
    
    setActiveTab: (tab) => {
      dispatch({ type: ACTION_TYPES.SET_ACTIVE_TAB, payload: tab });
    },
    
    setTheme: (theme) => {
      dispatch({ type: ACTION_TYPES.SET_THEME, payload: theme });
      localStorage.setItem('theme', theme);
    }
  }), []);

  const contextValue = useMemo(() => ({
    state,
    actions,
    ...computedValues
  }), [state, actions, computedValues]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Export for convenience
export { ACTION_TYPES };
