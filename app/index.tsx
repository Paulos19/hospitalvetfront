import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from '../src/services/api';
import { useAuthStore } from '../src/store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  
  const signIn = useAuthStore((state) => state.signIn);

  // Verifica se o usuário já passou pelo onboarding
  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
      if (hasSeen !== 'true') {
        // Se não viu, manda para o onboarding
        router.replace('/onboarding');
      }
    } catch (e) {
      console.log('Erro ao checar onboarding', e);
    } finally {
      setCheckingOnboarding(false);
    }
  };

  async function handleLogin() {
    if (!email || !password) return Alert.alert('Erro', 'Preencha todos os campos');

    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      await signIn(token, user); 
      
      if (user.role === 'CLIENT') {
        router.replace('/(client)/home');
      } else if (user.role === 'VET') {
        router.replace('/(vet)/dashboard');
      } else if (user.role === 'ADMIN') {
        router.replace('/(admin)/dashboard');
      } else {
        Alert.alert('Erro', 'Tipo de usuário desconhecido.');
      }
      
    } catch (error: any) {
      console.log(error);
      const msg = error.response?.data?.error || 'Verifique suas credenciais.';
      Alert.alert('Falha no Login', msg);
    } finally {
      setLoading(false);
    }
  }

  // Enquanto checa o AsyncStorage, mostra um loading simples para não piscar a tela
  if (checkingOnboarding) {
    return (
        <View className="flex-1 justify-center items-center bg-background">
            <ActivityIndicator color="#10B981" size="large" />
        </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-background justify-center px-6"
    >
      <StatusBar style="dark" />
      
      <View className="items-center mb-10">
        <View className="w-24 h-24 bg-secondary-100 rounded-full items-center justify-center mb-4">
          <Text className="text-4xl">🐾</Text>
        </View>
        <Text className="text-3xl font-bold text-primary-700">Cães & Cia</Text>
        <Text className="text-text-muted mt-2">Hospital Veterinário</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-text-main font-medium mb-1 ml-1">E-mail</Text>
          <TextInput 
            className="w-full bg-white border border-gray-200 p-4 rounded-xl text-text-main"
            placeholder="seu@email.com"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          <Text className="text-text-main font-medium mb-1 ml-1">Senha</Text>
          <TextInput 
            className="w-full bg-white border border-gray-200 p-4 rounded-xl text-text-main"
            placeholder="Sua senha secreta"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          onPress={handleLogin}
          disabled={loading}
          className={`w-full py-4 rounded-xl items-center mt-4 ${loading ? 'bg-gray-400' : 'bg-primary-500'}`}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text className="text-white font-bold text-lg">Acessar Conta</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center mt-8">
        <Text className="text-text-muted">Não tem conta? </Text>
        <Link href="/register" asChild>
          <TouchableOpacity>
            <Text className="text-primary-500 font-bold">Cadastre-se</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}