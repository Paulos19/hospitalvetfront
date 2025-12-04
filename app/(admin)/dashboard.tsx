import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // Importante para recarregar ao voltar
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from '@/src/services/api';

interface Vet {
  id: string;
  name: string;
  email: string;
  photoUrl?: string | null;
  specialty?: string | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Carrega os dados sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchVets();
    }, [])
  );

  async function fetchVets() {
    try {
      const response = await api.get('/admin/vets');
      setVets(response.data);
    } catch (error) {
      console.log('Erro ao buscar veterinários', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVets();
  };

  // Filtro de pesquisa local
  const filteredVets = vets.filter(vet => 
    vet.name.toLowerCase().includes(searchText.toLowerCase()) ||
    vet.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderHeader = () => (
    <View className="mb-6">
      {/* Cabeçalho de Boas-vindas */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-gray-500 text-sm font-medium">Painel Admin</Text>
          <Text className="text-2xl font-bold text-gray-800">Gestão Clínica</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.replace('/')} // Logout simplificado
          className="bg-gray-100 p-2 rounded-full"
        >
          <Ionicons name="log-out-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Card de Resumo */}
      <View className="bg-emerald-600 p-5 rounded-2xl shadow-lg mb-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-emerald-100 text-sm mb-1">Total de Veterinários</Text>
            <Text className="text-3xl font-bold text-white">{vets.length}</Text>
          </View>
          <View className="bg-emerald-500 p-3 rounded-xl">
            <Ionicons name="medkit" size={24} color="white" />
          </View>
        </View>
      </View>

      {/* Barra de Pesquisa */}
      <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput 
          className="flex-1 ml-3 text-gray-700 font-medium"
          placeholder="Buscar médico..."
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-lg font-bold text-gray-800 mt-6 mb-2">
        Equipe Médica
      </Text>
    </View>
  );

  const renderVetItem = ({ item }: { item: Vet }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => router.push(`/(admin)/vet/${item.id}`)}
      className="bg-white p-4 rounded-2xl mb-3 flex-row items-center border border-gray-100 shadow-sm"
    >
      {/* Avatar */}
      <Image 
        source={{ uri: item.photoUrl || `https://ui-avatars.com/api/?name=${item.name}&background=10b981&color=fff` }} 
        className="w-14 h-14 rounded-full bg-gray-200"
      />
      
      {/* Informações */}
      <View className="flex-1 ml-4">
        <Text className="text-base font-bold text-gray-800">{item.name}</Text>
        <Text className="text-emerald-600 text-xs font-bold uppercase mb-0.5">
          {item.specialty || 'Clínico Geral'}
        </Text>
        <Text className="text-gray-400 text-xs" numberOfLines={1}>{item.email}</Text>
      </View>

      {/* Seta */}
      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View className="flex-1 px-5 pt-2">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#059669" />
            <Text className="text-gray-400 mt-4 text-sm">Carregando equipe...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredVets}
            keyExtractor={(item) => item.id}
            renderItem={renderVetItem}
            ListHeaderComponent={renderHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#059669']} />
            }
            ListEmptyComponent={
              <View className="items-center justify-center py-10">
                <Ionicons name="people-outline" size={48} color="#E5E7EB" />
                <Text className="text-gray-400 mt-2 text-center">
                  Nenhum veterinário encontrado.{'\n'}Adicione um novo clicando abaixo.
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-emerald-600 w-14 h-14 rounded-full items-center justify-center shadow-lg elevation-5"
        onPress={() => router.push('/(admin)/create-vet')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}