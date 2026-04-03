import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Database, FileImage, ChevronUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ExportData = () => {
  const { state } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const exportToCSV = () => {
    setIsExporting(true);
    setIsOpen(false);
    
    // Create CSV content
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
    const rows = state.transactions.map(transaction => [
      transaction.date,
      transaction.description,
      transaction.category,
      transaction.amount.toString(),
      transaction.type
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setTimeout(() => setIsExporting(false), 500);
  };

  const exportToJSON = () => {
    setIsExporting(true);
    setIsOpen(false);
    
    // Create JSON content
    const jsonContent = JSON.stringify({
      exportDate: new Date().toISOString(),
      transactions: state.transactions,
      totalTransactions: state.transactions.length,
      totalIncome: state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      totalExpenses: state.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    }, null, 2);
    
    // Create and download file
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setTimeout(() => setIsExporting(false), 500);
  };

  const exportToPDF = () => {
    setIsExporting(true);
    setIsOpen(false);
    
    // Calculate financial summary
    const totalIncome = state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = state.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalBalance = totalIncome - totalExpenses;
    
    // Group transactions by category
    const categorySummary = {};
    state.transactions.forEach(transaction => {
      if (!categorySummary[transaction.category]) {
        categorySummary[transaction.category] = { income: 0, expenses: 0, count: 0 };
      }
      if (transaction.type === 'income') {
        categorySummary[transaction.category].income += transaction.amount;
      } else {
        categorySummary[transaction.category].expenses += transaction.amount;
      }
      categorySummary[transaction.category].count++;
    });

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Financial Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .summary { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .summary-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; width: 23%; text-align: center; }
          .summary-card h3 { margin: 0 0 10px 0; color: #666; }
          .summary-card .amount { font-size: 24px; font-weight: bold; color: #333; }
          .income { color: #10b981; }
          .expense { color: #ef4444; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .category-section { margin-bottom: 30px; }
          .category-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Financial Dashboard Report</h1>
          <p>Generated on ${new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>

        <div class="summary">
          <div class="summary-card">
            <h3>Total Balance</h3>
            <div class="amount ${totalBalance >= 0 ? 'income' : 'expense'}">₹${totalBalance.toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-card">
            <h3>Total Income</h3>
            <div class="amount income">₹${totalIncome.toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-card">
            <h3>Total Expenses</h3>
            <div class="amount expense">₹${totalExpenses.toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-card">
            <h3>Transactions</h3>
            <div class="amount">${state.transactions.length}</div>
          </div>
        </div>

        <div class="category-section">
          <div class="category-title">Category Summary</div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Income</th>
                <th>Expenses</th>
                <th>Net</th>
                <th>Transactions</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(categorySummary).map(([category, data]) => `
                <tr>
                  <td>${category}</td>
                  <td class="income">₹${data.income.toLocaleString('en-IN')}</td>
                  <td class="expense">₹${data.expenses.toLocaleString('en-IN')}</td>
                  <td class="${(data.income - data.expenses) >= 0 ? 'income' : 'expense'}">₹${(data.income - data.expenses).toLocaleString('en-IN')}</td>
                  <td>${data.count}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="category-section">
          <div class="category-title">Recent Transactions</div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${state.transactions.slice(0, 20).map(transaction => `
                <tr>
                  <td>${transaction.date}</td>
                  <td>${transaction.description}</td>
                  <td>${transaction.category}</td>
                  <td>${transaction.type}</td>
                  <td class="${transaction.type === 'income' ? 'income' : 'expense'}">${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ${state.transactions.length > 20 ? `<p><em>Showing 20 of ${state.transactions.length} transactions</em></p>` : ''}
        </div>

        <div class="footer">
          <p>Financial Dashboard 2026 - Detailed Financial Report</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window and print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setIsExporting(false);
      }, 500);
    };
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
        disabled={isExporting || state.transactions.length === 0}
      >
        <Download className="w-4 h-4" />
        <span>{isExporting ? 'Exporting...' : 'Export'}</span>
        <ChevronUp className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && state.transactions.length > 0 && (
        <div className="absolute top-full mt-2 right-0 bg-blue-600 border border-blue-700 rounded-lg shadow-lg p-2 min-w-48 z-50">
          <button
            onClick={exportToCSV}
            className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-blue-700 rounded transition-colors duration-200 text-white"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Export as CSV</span>
          </button>
          <button
            onClick={exportToJSON}
            className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-blue-700 rounded transition-colors duration-200 text-white"
          >
            <Database className="w-4 h-4" />
            <span className="text-sm">Export as JSON</span>
          </button>
          <button
            onClick={exportToPDF}
            className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-blue-700 rounded transition-colors duration-200 text-white"
          >
            <FileImage className="w-4 h-4" />
            <span className="text-sm">Export as PDF Report</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportData;
