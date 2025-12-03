import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { api } from '../src/services/api';
import { useAuthStore } from '../src/store/authStore';

// Componentes UI
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  
  const signIn = useAuthStore((state) => state.signIn);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
      if (hasSeen !== 'true') router.replace('/onboarding');
    } catch (e) { console.log(e); } 
    finally { setCheckingOnboarding(false); }
  };

  async function handleLogin() {
    if (!email || !password) return Alert.alert('Erro', 'Preencha todos os campos');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      await signIn(token, user);
      
      if (user.role === 'CLIENT') router.replace('/(client)/home');
      else if (user.role === 'VET') router.replace('/(vet)/dashboard');
      else if (user.role === 'ADMIN') router.replace('/(admin)/dashboard');
      
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Verifique suas credenciais.';
      Alert.alert('Falha no Login', msg);
    } finally {
      setLoading(false);
    }
  }

  if (checkingOnboarding) return <View className="flex-1 bg-white" />;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" />
      
      <View className="flex-1 px-8 justify-center">
        {/* Header Animado */}
        <Animated.View entering={FadeInUp.duration(1000).springify()} className="items-center mb-12">
          <View className="w-28 h-28 bg-emerald-50 rounded-full items-center justify-center mb-6 shadow-sm border border-emerald-100">
            <Text className="text-5xl">🐾</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo!</Text>
          <Text className="text-gray-500 text-center">
            Acesse para cuidar da saúde{'\n'}do seu melhor amigo.
          </Text>
        </Animated.View>

        {/* Formulário Animado */}
        <Animated.View entering={FadeInDown.duration(1000).delay(200).springify()} className="w-full">
          <Input 
            placeholder="E-mail" 
            icon="mail-outline" 
            value={email} 
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <Input 
            placeholder="Senha" 
            icon="lock-closed-outline" 
            isPassword 
            value={password}
            onChangeText={setPassword}
          />

          <View className="flex-row justify-end mb-6">
            <Text className="text-primary-500 font-semibold text-sm">Esqueceu a senha?</Text>
          </View>

          <Button 
            title="Entrar" 
            onPress={handleLogin} 
            loading={loading} 
            className="mb-4"
          />

          <Link href="/register" asChild>
            <Button 
              title="Criar nova conta" 
              variant="outline"
            />
          </Link>
        </Animated.View>
      </View>
      
      {/* Footer discreto */}
      <View className="pb-8 items-center">
        <Text className="text-gray-400 text-xs">Cães & Cia v1.0.0</Text>
      </View>
    </KeyboardAvoidingView>
  );
}