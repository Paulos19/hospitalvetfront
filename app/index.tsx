import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/ui/Logo'; // <--- IMPORTAÇÃO DA LOGO
import { api } from '../src/services/api';
import { useAuthStore } from '../src/store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuthStore(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOnboarding, setLoadingOnboarding] = useState(true);

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
      
      signIn(token, user); 

      if (user.role === 'CLIENT' && !user.myVetId) {
        router.replace('/link-vet');
      } else if (user.role === 'ADMIN') {
        router.replace('/(admin)/dashboard'); 
      } else if (user.role === 'VET') {
        router.replace('/(vet)/dashboard');
      } else {
        router.replace('/(client)/home');
      }

    } catch (error: any) {
      const msg = error.response?.data?.error || 'Erro ao fazer login';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  if (loadingOnboarding) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Logo size="small" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View className="items-center mb-12">
            {/* LOGO SUBSTITUÍDA AQUI */}
            <View className="mb-6">
              <Logo size="large" />
            </View>
            
            <Text className="text-2xl font-bold text-gray-800 text-center">
              Bem-vindo de volta!
            </Text>
            <Text className="text-gray-500 mt-2 text-center">
              Acesse para gerenciar a saúde do seu pet.
            </Text>
          </View>

          <View className="space-y-4">
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
          </View>

          <Button 
            title="Entrar" 
            onPress={handleLogin}
            loading={loading}
            className="mt-8"
          />

          <TouchableOpacity className="mt-4 items-center">
            <Text className="text-gray-400 text-sm font-medium">
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mt-12">
            <Text className="text-gray-500">Não tem conta?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="text-primary-500 font-bold ml-1">Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}