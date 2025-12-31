
import React, { useState, useMemo } from 'react';
import { TransactionType, Frequency, ALL_CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';
import { storageService } from '../services/storage';
import { Search, Plus, Trash2, ArrowUpCircle, ArrowDownCircle, X } from 'lucide-react';

const Transactions = ({ data, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const [newTx, setNewTx] = useState({
    type: TransactionType.EXPENSE,
    amount: 0,
    category: EXPENSE_CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    description: '',
    frequency: Frequency.ONCE
  });

  const filteredTransactions = useMemo(() => {
    return data.transactions.filter(t => {
      const matchesSearch = (t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'ALL' || t.type === filterType;
      const matchesCategory = filterCategory === 'ALL' || t.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [data.transactions, searchTerm, filterType, filterCategory]);

  const handleAdd = (e) => {
    e.preventDefault();
    const amountNum = Number(newTx.amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const tx = {
      id: Math.random().toString(36).substr(2, 9),
      ...newTx,
      amount: amountNum
    };

    storageService.addTransaction(tx);
    setShowForm(false);
    onUpdate();
    setNewTx({
      type: TransactionType.EXPENSE,
      amount: 0,
      category: EXPENSE_CATEGORIES[0],
      date: new Date().toISOString().split('T')[0],
      description: '',
      frequency: Frequency.ONCE
    });
  };

  const handleDelete = (id) => {
    if (confirm('Delete this transaction?')) {
      storageService.deleteTransaction(id);
      onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search records..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value={TransactionType.INCOME}>Income</option>
            <option value={TransactionType.EXPENSE}>Expense</option>
          </select>

          <button 
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md"
          >
            Add New
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <h2 className="text-lg font-bold">New Entry</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="flex p-1 bg-gray-100 rounded-lg mb-4">
                <button
                  type="button"
                  onClick={() => setNewTx({...newTx, type: TransactionType.INCOME, category: INCOME_CATEGORIES[0]})}
                  className={`flex-1 py-2 text-sm font-medium rounded-md ${newTx.type === TransactionType.INCOME ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'}`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setNewTx({...newTx, type: TransactionType.EXPENSE, category: EXPENSE_CATEGORIES[0]})}
                  className={`flex-1 py-2 text-sm font-medium rounded-md ${newTx.type === TransactionType.EXPENSE ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500'}`}
                >
                  Expense
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Amount</label>
                  <input 
                    type="number" required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="0.00"
                    // Ensure the state reflects the numeric value or an empty string
                    value={newTx.amount || ''}
                    onChange={(e) => setNewTx({...newTx, amount: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date</label>
                  <input 
                    type="date" required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                    value={newTx.date}
                    onChange={(e) => setNewTx({...newTx, date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Category</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newTx.category}
                  onChange={(e) => setNewTx({...newTx, category: e.target.value})}
                >
                  {(newTx.type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="What was this for?"
                  value={newTx.description}
                  onChange={(e) => setNewTx({...newTx, description: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100"
              >
                Save Record
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Transaction</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {t.type === TransactionType.INCOME ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{t.description || t.category}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase">
                    {t.category}
                  </span>
                </td>
                <td className={`px-6 py-4 font-bold text-sm ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(t.id)} className="text-gray-300 hover:text-rose-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
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
