// app/(admin)/dashboard.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';

interface Vet {
  id: string;
  name: string;
  email: string;
  crmv: string;
  inviteToken: string;
  patientsCount: number; // Assumindo que a API retorna isso
}

export default function AdminDashboard() {
  const router = useRouter();
  const [vets, setVets] = useState<Vet[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchVets(searchQuery = '') {
    setLoading(true);
    try {
      // Endpoint para buscar todos os Vets
      const response = await api.get('/admin/vets', {
        params: { search: searchQuery }
      });
      setVets(response.data);
    } catch (error) {
      console.error("Erro ao buscar veterinários:", error);
      Alert.alert('Erro', 'Falha ao carregar lista de veterinários.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchVets();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVets(search);
  };

  const filteredVets = vets.filter(vet =>
    vet.name.toLowerCase().includes(search.toLowerCase()) ||
    vet.crmv.toLowerCase().includes(search.toLowerCase())
  );
  
  // Card simplificado para o veterinário
  const renderVetCard = ({ item }: { item: Vet }) => (
    <TouchableOpacity
      className="bg-white p-4 mb-3 rounded-2xl shadow-sm border border-gray-100 active:bg-gray-50 flex-row items-center"
      onPress={() => router.push(`/admin/vet/${item.id}` as any)}
    >
      <View className="bg-emerald-100 p-3 rounded-xl mr-3">
        <Ionicons name="medical-outline" size={24} color="#10B981" />
      </View>
      <View className="flex-1">
        <Text className="font-bold text-lg text-gray-800">{item.name}</Text>
        <Text className="text-gray-500 text-sm">CRMV: {item.crmv}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={24} color="#D1D5DB" />
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <>
      <Text className="text-2xl font-bold text-gray-800 mt-4 mb-4">Gerenciar Veterinários</Text>

      {/* Barra de Busca */}
      <View className="flex-row items-center bg-white p-3 rounded-xl mb-4 shadow-sm border border-gray-100">
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          className="flex-1 ml-3 text-gray-700"
          placeholder="Buscar por nome ou CRMV..."
          value={search}
          onChangeText={setSearch}
          onEndEditing={() => fetchVets(search)}
        />
      </View>

      {/* Botão de Criação */}
      <TouchableOpacity
        className="flex-row items-center justify-center bg-emerald-500 p-4 rounded-xl mb-6 shadow-md shadow-emerald-500/40 active:bg-emerald-600"
        onPress={() => router.push('/(admin)/create-vet')}
      >
        <Ionicons name="person-add-outline" size={20} color="#fff" />
        <Text className="text-white font-bold text-base ml-2">Cadastrar Novo Médico</Text>
      </TouchableOpacity>
    </>
  );
  
  // Exibição de Loading
  if (loading) {
    return (
        <SafeAreaView className="flex-1 bg-gray-50 p-6">
            <Text className="text-center mt-20 text-gray-500">Carregando dados...</Text>
        </SafeAreaView>
    ); // Substituir por um Skeleton mais tarde
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={filteredVets}
        keyExtractor={(item) => item.id}
        renderItem={renderVetCard}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 50 }}
        ListHeaderComponent={ListHeader}
        refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor="#10B981"
            />
        }
        ListEmptyComponent={() => (
            <View className="items-center mt-10 p-6 bg-white rounded-xl">
                <Ionicons name="people-outline" size={60} color="#D1D5DB" />
                <Text className="text-gray-500 mt-3">Nenhum veterinário encontrado.</Text>
            </View>
        )}
      />
    </SafeAreaView>
  );
}