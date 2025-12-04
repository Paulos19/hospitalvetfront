import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ScrollView } from 'moti';
import { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../src/services/api';
import { useAuthStore } from '../src/store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOnboarding, setLoadingOnboarding] = useState(true);

  // 1. Verifica se o usuário já viu o onboarding
  useEffect(() => {
    async function checkOnboarding() {
      const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
      if (!hasSeen) {
        router.replace('/onboarding');
      }
      setLoadingOnboarding(false);
    }
    checkOnboarding();
  }, []);

  async function handleLogin() {
    if (!email || !password) return Alert.alert('Atenção', 'Preencha e-mail e senha.');

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Salva o token no storage e atualiza a store
      login(token, user);

      // Redireciona com base na Role
      if (user.role === 'CLIENT' && !user.myVetId) {
        // Redireciona para o vínculo obrigatório
        router.replace('/link-vet');
      } else if (user.role === 'VET' || user.role === 'ADMIN') {
        // Redireciona para a Home do Admin/Vet
        router.replace('/(admin)/dashboard'); 
      } else {
        // Redireciona para a Home do Cliente
        router.replace('/(client)/home');
      }

    } catch (error: any) {
      const msg = error.response?.data?.error || 'Erro ao fazer login';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  // Se estiver verificando o onboarding, não renderiza o formulário
  if (loadingOnboarding) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-center">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1 justify-center"
      >
        <ScrollView contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }} showsVerticalScrollIndicator={false}>

          <View className="items-center mb-10">
            {/* LOGO ADICIONADA */}
            <Image 
              source={require('../assets/images/logo-hvg.png')} 
              className="w-32 h-32 mb-4" 
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-primary-700">
              Bem-vindo
            </Text>
            <Text className="text-gray-500 mt-2">
              Entrar na sua conta
            </Text>
          </View>

          <Input 
            placeholder="E-mail" 
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Input 
            placeholder="Senha" 
            icon="lock-closed-outline"
            isPassword
            value={password}
            onChangeText={setPassword}
          />

          <Button 
            title="Entrar" 
            onPress={handleLogin}
            loading={loading}
            className="mt-6"
          />

          <TouchableOpacity className="mt-4 items-center">
            <Text className="text-gray-500 text-sm">
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mt-12">
            <Text className="text-gray-500">Não tem conta?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="text-primary-500 font-bold ml-1">Crie uma!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}