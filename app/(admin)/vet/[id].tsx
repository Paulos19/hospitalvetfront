// app/(admin)/vet/[id].tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/ui/Button'; // Ajuste o caminho
import { Input } from '../../../components/ui/Input'; // Ajuste o caminho
import { api } from '../../../src/services/api';

interface VetData {
  id: string;
  name: string;
  email: string;
  crmv: string;
  specialty: string;
  inviteToken: string;
}

export default function VetEditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [data, setData] = useState<Partial<VetData>>({});
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Carregar dados do veterinário
  async function fetchVetData() {
    setLoadingInitial(true);
    try {
      // API Backend: GET /api/admin/vets/[id]
      const response = await api.get(`/admin/vets/${id}`);
      setData(response.data);
    } catch (error) {
      console.error("Erro ao carregar dados do veterinário:", error);
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
      router.back();
    } finally {
      setLoadingInitial(false);
    }
  }

  useEffect(() => {
    if (id) fetchVetData();
  }, [id]);

  // Salvar Informações
  async function handleSaveInfo() {
    if (!data.name || !data.crmv) return Alert.alert('Atenção', 'Nome e CRMV são obrigatórios.');
    
    setLoading(true);
    try {
      // API Backend: PATCH /api/admin/vets/[id] (Apenas dados de info)
      await api.patch(`/admin/vets/${id}`, {
        name: data.name,
        crmv: data.crmv,
        specialty: data.specialty,
      });
      Alert.alert('Sucesso', 'Informações atualizadas!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar informações.');
    } finally {
      setLoading(false);
    }
  }

  // Alterar Senha
  async function handleChangePassword() {
    if (!password) return Alert.alert('Atenção', 'Nova senha é obrigatória.');
    if (password !== confirmPassword) return Alert.alert('Atenção', 'As senhas não coincidem.');
    
    setLoading(true);
    try {
      // API Backend: PATCH /api/admin/vets/[id] (Apenas senha)
      await api.patch(`/admin/vets/${id}`, { password });
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao alterar senha.');
    } finally {
      setLoading(false);
    }
  }

  if (loadingInitial) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">Aguarde, carregando...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
          
          <View className="bg-white p-6 rounded-3xl mb-6 shadow-md border-t-4 border-emerald-500">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Dados Pessoais: {data.name}
            </Text>

            <Input 
              placeholder="Nome Completo" 
              icon="person-outline"
              value={data.name}
              onChangeText={t => setData({...data, name: t})}
            />
            <Input 
              placeholder="CRMV" 
              icon="id-card-outline"
              value={data.crmv}
              onChangeText={t => setData({...data, crmv: t})}
            />
            <Input 
              placeholder="Especialidade" 
              icon="bandage-outline"
              value={data.specialty}
              onChangeText={t => setData({...data, specialty: t})}
            />
            
            <Text className="text-sm text-gray-500 mt-2">
                Token de convite: <Text className="font-bold text-emerald-600">{data.inviteToken}</Text>
            </Text>

            <Button
              title="Salvar Informações"
              onPress={handleSaveInfo}
              loading={loading}
              className="mt-6 bg-emerald-500"
            />
          </View>

          {/* Seção de Alteração de Senha */}
          <View className="bg-white p-6 rounded-3xl shadow-md border-t-4 border-red-500">
            <Text className="text-xl font-bold text-gray-800 mb-4">Alterar Senha</Text>

            <Input 
              placeholder="Nova Senha" 
              icon="lock-closed-outline"
              isPassword
              value={password}
              onChangeText={setPassword}
            />
            <Input 
              placeholder="Confirmar Nova Senha" 
              icon="lock-closed-outline"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <Button
              title="Alterar Senha"
              onPress={handleChangePassword}
              loading={loading}
              className="mt-6 bg-red-500"
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}