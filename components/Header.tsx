import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export const Header = () => {
  const { profile, signOut } = useAuth();

  return (
    <View className="bg-white border-b border-gray-200 px-4 py-3">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-bold text-gray-900">
            👋 Welcome back, {profile?.username || 'User'}!
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={signOut}
          className="px-4 py-2 bg-red-100 rounded-lg"
        >
          <Text className="text-red-600 font-medium">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};