import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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
import { api } from '../src/services/api';
import { useAuthStore } from '../src/store/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { signIn } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password || !confirmPassword) {
      return Alert.alert('Erro', 'Preencha todos os campos.');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Erro', 'As senhas não coincidem.');
    }

    setLoading(true);
    try {
      // 1. Criar conta
      const registerResponse = await api.post('/auth/register-client', {
        name,
        email,
        password
      });

      // 2. Fazer login automático após registro
      const loginResponse = await api.post('/auth/login', { email, password });
      const { token, user } = loginResponse.data;

      signIn(token, user);

      // Redireciona para o vínculo com o veterinário (fluxo padrão de novo cliente)
      router.replace('/link-vet');

    } catch (error: any) {
      const msg = error.response?.data?.error || 'Erro ao criar conta.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 40 }} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8">
            <Text className="text-3xl font-bold text-primary-700">Crie sua conta</Text>
            <Text className="text-gray-500 mt-2">
              Preencha os dados abaixo para começar.
            </Text>
          </View>

          <View className="space-y-4">
            <Input 
              placeholder="Nome Completo" 
              icon="person-outline"
              value={name}
              onChangeText={setName}
            />
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
            <Input 
              placeholder="Confirmar Senha" 
              icon="lock-closed-outline"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <Button 
            title="Cadastrar" 
            onPress={handleRegister} 
            loading={loading} 
            className="mt-8"
          />
          
          <View className="flex-row items-center justify-center mt-6">
            <Text className="text-gray-500">Já tem uma conta?</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-primary-500 font-bold ml-1">Faça Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}