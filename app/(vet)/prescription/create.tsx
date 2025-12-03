import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../src/services/api';

export default function CreatePrescriptionScreen() {
  const { petId, petName } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    medications: ''
  });

  async function handleSave() {
    if (!form.title || !form.description || !form.medications) {
      return Alert.alert('Atenção', 'Preencha todos os campos da receita.');
    }

    setLoading(true);
    try {
      await api.post('/vet/prescriptions', {
        ...form,
        petId: petId
      });

      Alert.alert('Sucesso', 'Receita emitida e enviada ao cliente!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar receita.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-6 py-4 border-b border-gray-100 bg-white flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="close" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View>
          <Text className="text-lg font-bold text-primary-700">Nova Receita</Text>
          <Text className="text-xs text-text-muted">Paciente: {petName}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="space-y-4 mb-6">
          <View>
            <Text className="mb-2 font-bold text-gray-700">Título / Diagnóstico</Text>
            <TextInput 
              className="bg-white p-4 rounded-xl border border-gray-200"
              placeholder="Ex: Otite Canina"
              value={form.title}
              onChangeText={t => setForm({...form, title: t})}
            />
          </View>

          <View>
            <Text className="mb-2 font-bold text-gray-700">Descrição Clínica</Text>
            <TextInput 
              className="bg-white p-4 rounded-xl border border-gray-200 h-24"
              placeholder="Descreva os sintomas observados..."
              multiline
              textAlignVertical="top"
              value={form.description}
              onChangeText={t => setForm({...form, description: t})}
            />
          </View>

          <View>
            <Text className="mb-2 font-bold text-gray-700">Medicação e Posologia</Text>
            <TextInput 
              className="bg-white p-4 rounded-xl border border-gray-200 h-32"
              placeholder="Ex: 1. Remédio X - 1cp a cada 12h..."
              multiline
              textAlignVertical="top"
              value={form.medications}
              onChangeText={t => setForm({...form, medications: t})}
            />
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleSave}
          disabled={loading}
          className="bg-primary-500 py-4 rounded-xl items-center shadow-lg mb-10"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Assinar e Emitir</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}