import React, { useState } from 'react';
import { Search, Plus, ArrowUpCircle, ArrowDownCircle, SortAsc, SortDesc, Edit, Trash2 } from 'lucide-react';
import { categories } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

const Transactions = () => {
  const { state, actions, filteredTransactions, isAdmin } = useAppContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    category: '',
    amount: '',
    type: 'expense',
    description: ''
  });

  const handleAddTransaction = () => {
    if (newTransaction.date && newTransaction.category && newTransaction.amount) {
      actions.addTransaction({
        ...newTransaction,
        id: Date.now(),
        amount: parseFloat(newTransaction.amount)
      });
      setNewTransaction({
        date: '',
        category: '',
        amount: '',
        type: 'expense',
        description: ''
      });
      setShowAddForm(false);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      date: transaction.date,
      category: transaction.category,
      amount: transaction.amount.toString(),
      type: transaction.type,
      description: transaction.description
    });
    setShowAddForm(true);
  };

  const handleUpdateTransaction = () => {
    if (editingTransaction && newTransaction.date && newTransaction.category && newTransaction.amount) {
      actions.updateTransaction(editingTransaction.id, {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount)
      });
      setEditingTransaction(null);
      setNewTransaction({
        date: '',
        category: '',
        amount: '',
        type: 'expense',
        description: ''
      });
      setShowAddForm(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setNewTransaction({
      date: '',
      category: '',
      amount: '',
      type: 'expense',
      description: ''
    });
    setShowAddForm(false);
  };

  const toggleSort = (field) => {
    if (state.filters.sortBy === field) {
      actions.updateFilter('sortOrder', state.filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      actions.updateFilter('sortBy', field);
      actions.updateFilter('sortOrder', 'desc');
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 card-shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </button>
        )}
      </div>

      {showAddForm && isAdmin && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <select
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Amount"
            />
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input
              type="text"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Description"
            />
            <button
              onClick={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
              className="bg-success text-white px-4 py-2 rounded-lg hover:bg-success/90 transition-colors"
            >
              {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
            </button>
            {editingTransaction && (
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={state.filters.searchTerm}
                onChange={(e) => actions.updateFilter('searchTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          
          <select
            value={state.filters.categoryFilter}
            onChange={(e) => actions.updateFilter('categoryFilter', e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select
            value={state.filters.typeFilter}
            onChange={(e) => actions.updateFilter('typeFilter', e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={state.filters.dateFilter}
            onChange={(e) => actions.updateFilter('dateFilter', e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <select
            value={state.filters.sortBy}
            onChange={(e) => actions.updateFilter('sortBy', e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                <button
                  onClick={() => toggleSort('date')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Date</span>
                  {state.filters.sortBy === 'date' && (
                    state.filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Description</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                <button
                  onClick={() => toggleSort('amount')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors justify-end"
                >
                  <span>Amount</span>
                  {state.filters.sortBy === 'amount' && (
                    state.filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{transaction.date}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm dark:text-gray-300">
                    {transaction.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{transaction.description}</td>
                <td className={`py-3 px-4 text-right font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4 text-center">
                  {transaction.type === 'income' ? (
                    <ArrowUpCircle className="w-5 h-5 text-green-600 mx-auto" />
                  ) : (
                    <ArrowDownCircle className="w-5 h-5 text-red-600 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="p-1 bg-blue-100 hover:bg-blue-200 rounded transition-colors"
                          title="Edit transaction"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => actions.deleteTransaction(transaction.id)}
                          className="p-1 bg-red-100 hover:bg-red-200 rounded transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
