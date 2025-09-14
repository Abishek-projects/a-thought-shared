import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { signIn, signUp, loading, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  React.useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = isSignUp 
      ? await signUp(username.trim(), password)
      : await signIn(username.trim(), password);

    if (result.error) {
      Alert.alert('Error', result.error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text className="text-center text-gray-600">
            {isSignUp 
              ? 'Create your expense tracker account' 
              : 'Sign in to your expense tracker'
            }
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Username</Text>
            <TextInput
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
            <TextInput
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            className={`w-full py-4 rounded-lg ${
              loading || !username.trim() || !password.trim()
                ? 'bg-gray-300'
                : 'bg-blue-600'
            }`}
            onPress={handleSubmit}
            disabled={loading || !username.trim() || !password.trim()}
          >
            <Text className="text-center text-white font-semibold text-lg">
              {loading 
                ? (isSignUp ? 'Creating Account...' : 'Signing In...')
                : (isSignUp ? 'Create Account' : 'Sign In')
              }
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsSignUp(!isSignUp)}
            disabled={loading}
            className="py-2"
          >
            <Text className="text-center text-blue-600">
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Create one"
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}