import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { ExpenseSummary } from '../components/ExpenseSummary';
import { Header } from '../components/Header';
import { useSupabaseExpenses } from '../hooks/useSupabaseExpenses';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user, loading: authLoading } = useAuth();
  const { expenses, loading, addExpense, deleteExpense, getSummary } = useSupabaseExpenses();
  const summary = getSummary();

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header />
      <ScrollView className="flex-1 px-4">
        <View className="py-6 space-y-6">
          {/* Welcome Section */}
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              💰 Expense Tracker
            </Text>
            <Text className="text-gray-600">
              Track your daily expenses and take control of your finances
            </Text>
          </View>

          {/* Summary Cards */}
          <ExpenseSummary summary={summary} />

          {/* Add Expense Form */}
          <ExpenseForm onAddExpense={addExpense} />

          {/* Expenses List */}
          <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}