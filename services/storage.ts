
const STORAGE_KEY = 'fintrack_data';

const DEFAULT_DATA = {
  transactions: [
    { id: '1', type: 'INCOME', amount: 5000, category: 'Salary', date: new Date().toISOString().split('T')[0], description: 'Monthly Salary' },
    { id: '2', type: 'EXPENSE', amount: 1200, category: 'Housing', date: new Date().toISOString().split('T')[0], description: 'Rent payment' },
    { id: '3', type: 'EXPENSE', amount: 150, category: 'Food & Dining', date: new Date().toISOString().split('T')[0], description: 'Groceries' },
  ],
  budgets: [
    { category: 'Food & Dining', limit: 500 },
    { category: 'Housing', limit: 1500 },
    { category: 'Transportation', limit: 300 }
  ],
  user: null
};

export const storageService = {
  getData: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_DATA;
  },

  saveData: (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  addTransaction: (transaction) => {
    const data = storageService.getData();
    data.transactions.unshift(transaction);
    storageService.saveData(data);
    return data.transactions;
  },

  deleteTransaction: (id) => {
    const data = storageService.getData();
    data.transactions = data.transactions.filter(t => t.id !== id);
    storageService.saveData(data);
    return data.transactions;
  },

  updateBudgets: (budgets) => {
    const data = storageService.getData();
    data.budgets = budgets;
    storageService.saveData(data);
    return data.budgets;
  },

  setUser: (user) => {
    const data = storageService.getData();
    data.user = user;
    storageService.saveData(data);
  }
};
