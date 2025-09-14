import React from 'react';
import { View, Text } from 'react-native';
import { ExpenseSummary as ExpenseSummaryType } from '../types/expense';

interface ExpenseSummaryProps {
  summary: ExpenseSummaryType;
}

export const ExpenseSummary = ({ summary }: ExpenseSummaryProps) => {
  const summaryCards = [
    {
      title: 'Today',
      amount: summary.totalToday,
      emoji: '📅',
      color: 'bg-green-100',
      textColor: 'text-green-800',
    },
    {
      title: 'This Week',
      amount: summary.totalWeek,
      emoji: '📊',
      color: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    {
      title: 'This Month',
      amount: summary.totalMonth,
      emoji: '📈',
      color: 'bg-purple-100',
      textColor: 'text-purple-800',
    },
    {
      title: 'Total',
      amount: summary.totalAll,
      emoji: '💰',
      color: 'bg-orange-100',
      textColor: 'text-orange-800',
    },
  ];

  return (
    <View className="space-y-3">
      <Text className="text-lg font-semibold text-gray-900">Summary</Text>
      <View className="flex-row flex-wrap justify-between">
        {summaryCards.map((card, index) => (
          <View
            key={index}
            className={`${card.color} rounded-xl p-4 mb-3 w-[48%]`}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-2xl">{card.emoji}</Text>
              <Text className={`text-sm font-medium ${card.textColor}`}>
                {card.title}
              </Text>
            </View>
            <Text className={`text-2xl font-bold ${card.textColor}`}>
              ${card.amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};