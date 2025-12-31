
import React, { useState } from 'react';
import { EXPENSE_CATEGORIES } from '../constants';
import { storageService } from '../services/storage';
import { Plus, X, Trash2, PieChart as PieIcon } from 'lucide-react';

const Budgets = ({ data, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: EXPENSE_CATEGORIES[0], limit: 0 });

  const stats = data.budgets.map(b => {
    const actual = data.transactions
      .filter(t => t.type === 'EXPENSE' && t.category === b.category)
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...b, actual };
  });

  const handleSave = (e) => {
    e.preventDefault();
    const existing = data.budgets.filter(b => b.category !== newBudget.category);
    storageService.updateBudgets([...existing, newBudget]);
    setShowForm(false);
    onUpdate();
    setNewBudget({ category: EXPENSE_CATEGORIES[0], limit: 0 });
  };

  const handleDelete = (category) => {
    if (confirm(`Remove budget for ${category}?`)) {
      const filtered = data.budgets.filter(b => b.category !== category);
      storageService.updateBudgets(filtered);
      onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Budget Goals</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-indigo-700"
        >
          Set New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(budget => {
          const percentage = Math.min((budget.actual / budget.limit) * 100, 100);
          return (
            <div key={budget.category} className="bg-white p-6 rounded-3xl shadow-sm border group">
              <div className="flex justify-between items-start mb-4">
                <span className="font-bold text-gray-800">{budget.category}</span>
                <button onClick={() => handleDelete(budget.category)} className="text-gray-300 hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Spent</span>
                <span className="text-sm font-bold text-gray-900">${budget.actual.toLocaleString()} / ${budget.limit.toLocaleString()}</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${percentage >= 100 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8">
            <h3 className="text-xl font-bold mb-6">Set Spending Goal</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                <select 
                  className="w-full mt-1 px-3 py-2 border rounded-xl"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                >
                  {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Limit Amount ($)</label>
                <input 
                  type="number" required
                  className="w-full mt-1 px-3 py-2 border rounded-xl"
                  value={newBudget.limit || ''}
                  onChange={(e) => setNewBudget({...newBudget, limit: Number(e.target.value)})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 text-gray-400 font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">Save Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
