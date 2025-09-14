import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Expense, EXPENSE_CATEGORIES } from '../types/expense';
import { format } from 'date-fns';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export const ExpenseList = ({ expenses, onDeleteExpense }: ExpenseListProps) => {
  const getCategoryInfo = (category: string) => {
    return EXPENSE_CATEGORIES.find(cat => cat.value === category);
  };

  const handleDelete = (id: string, description: string) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${description}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDeleteExpense(id) },
      ]
    );
  };

  if (expenses.length === 0) {
    return (
      <View className="bg-white rounded-2xl p-8 shadow-sm">
        <View className="items-center">
          <Text className="text-6xl mb-4">💸</Text>
          <Text className="text-xl font-bold text-gray-900 mb-2">
            No expenses yet!
          </Text>
          <Text className="text-gray-600 text-center">
            Start tracking your money today and take control of your finances ✨
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-gray-900">
          💳 Recent Expenses
        </Text>
        <View className="bg-gray-100 px-3 py-1 rounded-full">
          <Text className="text-sm font-semibold text-gray-700">
            {expenses.length} total
          </Text>
        </View>
      </View>

      <ScrollView className="space-y-3" showsVerticalScrollIndicator={false}>
        {expenses.map((expense) => {
          const categoryInfo = getCategoryInfo(expense.category);
          
          return (
            <View
              key={expense.id}
              className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-white rounded-lg items-center justify-center mr-3">
                  <Text className="text-2xl">{categoryInfo?.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900" numberOfLines={1}>
                    {expense.description}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-xs text-gray-500 mr-3">
                      {categoryInfo?.label}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {format(new Date(expense.date), 'MMM dd')}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center">
                <Text className="text-lg font-bold text-blue-600 mr-3">
                  ${expense.amount.toFixed(2)}
                </Text>
                
                <TouchableOpacity
                  onPress={() => handleDelete(expense.id, expense.description)}
                  className="w-8 h-8 bg-red-100 rounded-full items-center justify-center"
                >
                  <Text className="text-red-600 font-bold">×</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};