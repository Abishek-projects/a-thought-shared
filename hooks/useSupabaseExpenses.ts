import { useState, useEffect, useCallback } from 'react';
import { supabase, DatabaseExpense } from '../lib/supabase';
import { Expense, ExpenseCategory, ExpenseSummary } from '../types/expense';
import { useAuth } from './useAuth';
import { Alert } from 'react-native';

export const useSupabaseExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Convert database expense to app expense format
  const convertDbExpenseToExpense = (dbExpense: DatabaseExpense): Expense => ({
    id: dbExpense.id,
    amount: Number(dbExpense.amount),
    category: dbExpense.category as ExpenseCategory,
    description: dbExpense.description,
    date: dbExpense.date,
    createdAt: dbExpense.created_at,
  });

  // Load expenses from Supabase
  const loadExpenses = useCallback(async () => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading expenses:', error);
        Alert.alert('Error', 'Failed to load expenses');
        return;
      }

      const convertedExpenses = data.map(convertDbExpenseToExpense);
      setExpenses(convertedExpenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
      Alert.alert('Error', 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadExpenses();

    // Set up real-time subscription for expenses
    if (user) {
      const channel = supabase
        .channel('expenses_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'expenses',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Real-time update:', payload);
            
            if (payload.eventType === 'INSERT') {
              const newExpense = convertDbExpenseToExpense(payload.new as DatabaseExpense);
              setExpenses(prev => [newExpense, ...prev.filter(e => e.id !== newExpense.id)]);
            } else if (payload.eventType === 'DELETE') {
              setExpenses(prev => prev.filter(e => e.id !== payload.old.id));
            } else if (payload.eventType === 'UPDATE') {
              const updatedExpense = convertDbExpenseToExpense(payload.new as DatabaseExpense);
              setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [loadExpenses, user]);

  // Add new expense
  const addExpense = useCallback(async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to add expenses');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          amount: expenseData.amount,
          category: expenseData.category,
          description: expenseData.description,
          date: expenseData.date,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding expense:', error);
        Alert.alert('Error', 'Failed to add expense');
        return;
      }

      const newExpense = convertDbExpenseToExpense(data);
      setExpenses(prev => [newExpense, ...prev]);

      Alert.alert('Success', `Added $${expenseData.amount} for ${expenseData.category}`);
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', 'Failed to add expense');
    }
  }, [user]);

  // Delete expense
  const deleteExpense = useCallback(async (id: string) => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to delete expenses');
      return;
    }

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting expense:', error);
        Alert.alert('Error', 'Failed to delete expense');
        return;
      }

      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      Alert.alert('Error', 'Failed to delete expense');
    }
  }, [user]);

  // Calculate summary
  const getSummary = useCallback((): ExpenseSummary => {
    const now = new Date();
    const today = now.toDateString();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalToday = expenses
      .filter(expense => new Date(expense.date).toDateString() === today)
      .reduce((sum, expense) => sum + expense.amount, 0);

    const totalWeek = expenses
      .filter(expense => new Date(expense.date) >= weekStart)
      .reduce((sum, expense) => sum + expense.amount, 0);

    const totalMonth = expenses
      .filter(expense => new Date(expense.date) >= monthStart)
      .reduce((sum, expense) => sum + expense.amount, 0);

    const totalAll = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const categorySummary = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    return {
      totalToday,
      totalWeek,
      totalMonth,
      totalAll,
      categorySummary
    };
  }, [expenses]);

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    getSummary
  };
};