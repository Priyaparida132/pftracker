
export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE'
};

export const Frequency = {
  ONCE: 'ONCE',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY'
};

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Housing',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Health',
  'Education',
  'Miscellaneous'
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Bonus',
  'Freelance',
  'Investment',
  'Gift',
  'Other'
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
