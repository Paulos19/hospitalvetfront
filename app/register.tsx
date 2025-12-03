import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from '../src/services/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    vetToken: '' // O Token crucial
  });

  async function handleRegister() {
    try {
      // Validações básicas (pode melhorar com Zod no front depois)
      if (!formData.vetToken) return Alert.alert('Atenção', 'O código do médico é obrigatório.');

      await api.post('/auth/register-client', formData);
      
      Alert.alert('Sucesso!', 'Conta criada. Faça login para continuar.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Erro ao criar conta';
      Alert.alert('Erro', msg);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <View className="pt-12 px-6 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="#10B981" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-primary-700">Criar Conta</Text>
        <Text className="text-text-muted">Preencha os dados do tutor do pet.</Text>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Input Genérico Componentizável */}
        <View className="space-y-4">
          <TextInput 
            className="bg-white border border-gray-200 p-4 rounded-xl"
            placeholder="Nome Completo"
            value={formData.name}
            onChangeText={t => setFormData({...formData, name: t})}
          />
          <TextInput 
            className="bg-white border border-gray-200 p-4 rounded-xl"
            placeholder="CPF (apenas números)"
            keyboardType="numeric"
            value={formData.cpf}
            onChangeText={t => setFormData({...formData, cpf: t})}
          />
          <TextInput 
            className="bg-white border border-gray-200 p-4 rounded-xl"
            placeholder="E-mail"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={t => setFormData({...formData, email: t})}
          />
          <TextInput 
            className="bg-white border border-gray-200 p-4 rounded-xl"
            placeholder="Senha"
            secureTextEntry
            value={formData.password}
            onChangeText={t => setFormData({...formData, password: t})}
          />

          <View className="mt-4 p-4 bg-secondary-100 rounded-xl border border-primary-500 border-dashed">
            <Text className="text-primary-700 font-bold mb-2 text-center">Área de Vinculação</Text>
            <Text className="text-xs text-text-muted text-center mb-3">
              Insira o código fornecido pelo seu veterinário para vincular seus pets a ele.
            </Text>
            <TextInput 
              className="bg-white border border-gray-200 p-4 rounded-xl text-center font-bold tracking-widest uppercase"
              placeholder="CÓDIGO (EX: VET-SILVA)"
              value={formData.vetToken}
              onChangeText={t => setFormData({...formData, vetToken: t.toUpperCase()})}
            />
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleRegister}
          className="w-full bg-primary-500 py-4 rounded-xl items-center mt-8 shadow-lg shadow-primary-500/30"
        >
          <Text className="text-white font-bold text-lg">Finalizar Cadastro</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}