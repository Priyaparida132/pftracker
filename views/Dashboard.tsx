
import React, { useMemo } from 'react';
import { TransactionType } from '../constants';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Wallet, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const Dashboard = ({ data }) => {
  const totals = useMemo(() => {
    return data.transactions.reduce((acc, t) => {
      // Ensure values are numbers for arithmetic operations
      const amount = Number(t.amount) || 0;
      if (t.type === TransactionType.INCOME) acc.income += amount;
      else acc.expense += amount;
      return acc;
    }, { income: 0, expense: 0 });
  }, [data.transactions]);

  const balance = totals.income - totals.expense;

  const categoryData = useMemo(() => {
    const expenses = data.transactions.filter(t => t.type === TransactionType.EXPENSE);
    const groups = {};
    expenses.forEach(e => {
      groups[e.category] = (groups[e.category] || 0) + (Number(e.amount) || 0);
    });
    return Object.entries(groups)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => (b.value as number) - (a.value as number));
  }, [data.transactions]);

  const monthlyHistory = useMemo(() => {
    const sorted = [...data.transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const groups: Record<string, { income: number; expense: number }> = {};
    
    sorted.slice(-20).forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      if (!groups[month]) groups[month] = { income: 0, expense: 0 };
      const amount = Number(t.amount) || 0;
      if (t.type === TransactionType.INCOME) groups[month].income += amount;
      else groups[month].expense += amount;
    });

    return Object.entries(groups).map(([name, { income, expense }]) => ({ name, income, expense }));
  }, [data.transactions]);

  const budgetStats = useMemo(() => {
    return data.budgets.map(b => {
      const actual = data.transactions
        .filter(t => t.type === TransactionType.EXPENSE && t.category === b.category)
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      return { ...b, actual };
    });
  }, [data.budgets, data.transactions]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Current Balance" 
          amount={balance} 
          icon={<Wallet className="text-white" size={24} />} 
          variant="indigo" 
        />
        <StatCard 
          title="Total Earnings" 
          amount={totals.income} 
          icon={<ArrowUpRight className="text-white" size={24} />} 
          variant="emerald" 
        />
        <StatCard 
          title="Total Spending" 
          amount={totals.expense} 
          icon={<ArrowDownRight className="text-white" size={24} />} 
          variant="rose" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">Cash Flow Trend</h3>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Trends</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" barSize={30} />
                <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} name="Expense" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">Distribution</h3>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">By Category</span>
          </div>
          <div className="h-[300px] flex flex-col sm:flex-row items-center">
            <div className="w-full sm:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 space-y-3 mt-4 sm:mt-0 px-4 overflow-y-auto max-h-full">
              {categoryData.slice(0, 5).map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}} />
                    <span className="text-sm font-medium text-gray-600">{entry.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">${entry.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Target className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Goals & Budgets</h3>
            <p className="text-xs text-gray-500">Tracking your spending against limits</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {budgetStats.length > 0 ? budgetStats.map(budget => {
            const percentage = Math.min((budget.actual / budget.limit) * 100, 100);
            const isOver = budget.actual > budget.limit;
            return (
              <div key={budget.category} className="group">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{budget.category}</span>
                    <p className={`text-sm font-bold mt-1 ${isOver ? 'text-rose-600' : 'text-gray-900'}`}>
                      ${budget.actual.toLocaleString()} <span className="text-gray-400 font-medium">/ ${budget.limit.toLocaleString()}</span>
                    </p>
                  </div>
                  <span className={`text-xs font-black ${isOver ? 'text-rose-600' : 'text-indigo-600'}`}>
                    {Math.round(percentage)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${isOver ? 'bg-gradient-to-r from-rose-500 to-rose-400' : 'bg-gradient-to-r from-indigo-600 to-indigo-400'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          }) : (
            <p className="col-span-full text-center text-gray-400 py-10">No budgets set yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, amount, icon, variant }) => {
  const styles = {
    indigo: 'bg-indigo-600 shadow-indigo-200',
    emerald: 'bg-emerald-600 shadow-emerald-200',
    rose: 'bg-rose-600 shadow-rose-200'
  };

  return (
    <div className={`p-6 rounded-3xl shadow-xl transition-all hover:scale-[1.02] duration-300 group ${styles[variant]}`}>
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-white/70">{title}</p>
          <p className="text-2xl font-bold text-white tracking-tight">${amount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
