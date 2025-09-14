import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ExpenseCategory, EXPENSE_CATEGORIES } from '../types/expense';

interface ExpenseFormProps {
  onAddExpense: (expense: {
    amount: number;
    category: ExpenseCategory;
    description: string;
    date: string;
  }) => void;
}

export const ExpenseForm = ({ onAddExpense }: ExpenseFormProps) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddExpense({
        amount: numAmount,
        category,
        description: description.trim(),
        date: new Date().toISOString(),
      });

      // Reset form
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', 'Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm">
      <Text className="text-xl font-bold text-gray-900 mb-4">
        💸 Add New Expense
      </Text>

      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Amount</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            editable={!isSubmitting}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-2">
              {EXPENSE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  onPress={() => setCategory(cat.value)}
                  className={`px-4 py-3 rounded-lg border-2 ${
                    category === cat.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <Text className="text-2xl mb-1">{cat.icon}</Text>
                  <Text className="text-xs font-medium text-center">
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
            placeholder="What did you spend on?"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            editable={!isSubmitting}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting || !amount || !description.trim()}
          className={`w-full py-4 rounded-lg ${
            isSubmitting || !amount || !description.trim()
              ? 'bg-gray-300'
              : 'bg-blue-600'
          }`}
        >
          <Text className="text-center text-white font-semibold text-lg">
            {isSubmitting ? 'Adding...' : '💸 Add Expense'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};