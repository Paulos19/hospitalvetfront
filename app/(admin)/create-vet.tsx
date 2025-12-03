import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';

export default function CreateVetScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '', // Lembrete: Adicionar máscara de CPF se desejar depois
    crmv: '',
    specialty: ''
  });

  async function handleCreate() {
    if (!form.name || !form.email || !form.password || !form.crmv) {
      return Alert.alert('Erro', 'Preencha os campos obrigatórios.');
    }

    setLoading(true);
    try {
      const res = await api.post('/admin/create-vet', form);
      Alert.alert(
        'Sucesso!', 
        `Veterinário cadastrado.\nToken gerado: ${res.data.inviteToken}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.error || 'Falha ao cadastrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-6">
        <View className="flex-row items-center my-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#047857" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-primary-700 ml-4">Novo Veterinário</Text>
        </View>

        <View className="space-y-4">
          <TextInput 
            className="bg-white p-4 rounded-xl border border-gray-200"
            placeholder="Nome Completo"
            value={form.name}
            onChangeText={t => setForm({...form, name: t})}
          />
          <TextInput 
            className="bg-white p-4 rounded-xl border border-gray-200"
            placeholder="E-mail Profissional"
            autoCapitalize="none"
            value={form.email}
            onChangeText={t => setForm({...form, email: t})}
          />
          <TextInput 
            className="bg-white p-4 rounded-xl border border-gray-200"
            placeholder="Senha Inicial"
            secureTextEntry
            value={form.password}
            onChangeText={t => setForm({...form, password: t})}
          />
          <TextInput 
            className="bg-white p-4 rounded-xl border border-gray-200"
            placeholder="CPF (apenas números)"
            keyboardType="numeric"
            value={form.cpf}
            onChangeText={t => setForm({...form, cpf: t})}
          />
          
          <View className="flex-row gap-4">
            <TextInput 
              className="flex-1 bg-white p-4 rounded-xl border border-gray-200"
              placeholder="CRMV"
              value={form.crmv}
              onChangeText={t => setForm({...form, crmv: t})}
            />
            <TextInput 
              className="flex-1 bg-white p-4 rounded-xl border border-gray-200"
              placeholder="Especialidade"
              value={form.specialty}
              onChangeText={t => setForm({...form, specialty: t})}
            />
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleCreate}
          disabled={loading}
          className="bg-primary-700 mt-8 py-4 rounded-xl items-center shadow-lg"
        >
          <Text className="text-white font-bold text-lg">
            {loading ? 'Cadastrando...' : 'Cadastrar Médico'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}