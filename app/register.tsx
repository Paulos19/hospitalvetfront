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
import { Logo } from '../components/ui/Logo';
import { api } from '../src/services/api';
import { useAuthStore } from '../src/store/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { signIn } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState(''); // <--- NOVO ESTADO
  const [vetToken, setVetToken] = useState(''); // <--- NOVO ESTADO
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    // Validação atualizada para incluir CPF e vetToken
    if (!name || !email || !password || !confirmPassword || !cpf || !vetToken) {
      return Alert.alert('Erro', 'Preencha todos os campos.');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Erro', 'As senhas não coincidem.');
    }

    setLoading(true);
    try {
      // Enviando os novos campos para o backend
      await api.post('/auth/register-client', {
        name,
        email,
        password,
        cpf,       // <--- ENVIANDO CPF
        vetToken   // <--- ENVIANDO CÓDIGO
      });

      // Login automático após registro
      const loginResponse = await api.post('/auth/login', { email, password });
      const { token, user } = loginResponse.data;

      signIn(token, user);
      
      // Como o usuário já se vinculou no registro, talvez não precise ir para link-vet.
      // Você pode redirecionar direto para a home se preferir: router.replace('/(client)/home');
      router.replace('/link-vet'); 

    } catch (error: any) {
      console.log(error.response?.data); // Útil para debug
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
          <View className="items-center mb-6">
            <Logo size="medium" showText={false} />
          </View>

          <View className="mb-6 items-center">
            <Text className="text-3xl font-bold text-primary-700">Crie sua conta</Text>
            <Text className="text-gray-500 mt-2 text-center">
              Preencha os dados e informe o código do seu veterinário.
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
              placeholder="CPF" 
              icon="card-outline"
              keyboardType="numeric"
              value={cpf}
              onChangeText={setCpf}
            />
             {/* CAMPO NOVO: Código do Veterinário */}
            <Input 
              placeholder="Código do Veterinário (Ex: DR-SILVA)" 
              icon="medkit-outline"
              autoCapitalize="characters"
              value={vetToken}
              onChangeText={setVetToken}
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