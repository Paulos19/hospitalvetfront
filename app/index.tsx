import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from '../src/services/api';
import { useAuthStore } from '../src/store/authStore';

export default function LoginScreen() {
  const router = useRouter(); // O hook de navegação deve ser usado aqui
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore((state) => state.signIn);

  async function handleLogin() {
    if (!email || !password) return Alert.alert('Erro', 'Preencha todos os campos');

    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      // 1. Salva no estado global
      await signIn(token, user); 
      
      // 2. Faz o redirecionamento baseado no cargo (ROLE)
      // Adicionamos o caso ADMIN que faltava
      if (user.role === 'CLIENT') {
        router.replace('/(client)/home');
      } else if (user.role === 'VET') {
        router.replace('/(vet)/dashboard'); // Certifique-se de criar essa rota depois
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