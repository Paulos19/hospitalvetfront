import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';

// Interfaces de tipagem dos dados vindos da API
interface Pet {
  id: string;
  name: string;
  breed: string;
  photoUrl: string | null;
}

interface Client {
  id: string;
  name: string;
  email: string;
  pets: Pet[];
}

export default function VetDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Função para buscar a lista de clientes e seus pets
  async function fetchClients() {
    setRefreshing(true);
    try {
      const res = await api.get('/vet/clients');
      setClients(res.data);
    } catch (error) {
      console.log('Erro ao buscar pacientes');
    } finally {
      setRefreshing(false);
    }
  }

  // Carrega os dados ao abrir a tela
  useEffect(() => { fetchClients(); }, []);

  // Renderiza cada Cliente (Tutor)
  const renderClient = ({ item }: { item: Client }) => (
    <View className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-gray-100">
      {/* Cabeçalho do Card: Dados do Tutor */}
      <View className="flex-row items-center border-b border-gray-100 pb-3 mb-3">
        <View className="w-10 h-10 bg-secondary-100 rounded-full items-center justify-center">
          <Ionicons name="person" size={20} color="#047857" />
        </View>
        <View className="ml-3">
          <Text className="text-lg font-bold text-primary-700">{item.name}</Text>
          <Text className="text-text-muted text-xs">{item.pets.length} pet(s) cadastrado(s)</Text>
        </View>
      </View>

      {/* Lista Horizontal de Pets desse Cliente */}
      {item.pets.length > 0 ? (
        <FlatList
          data={item.pets}
          horizontal
          keyExtractor={pet => pet.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: pet }) => (
            <TouchableOpacity
              // Navega para a tela de detalhes do Pet passando o ID
              onPress={() => router.push({
                pathname: '/(vet)/pet/[id]', // O caminho exato do arquivo
                params: { id: pet.id }       // O valor dinâmico
              })}
              className="mr-4 items-center w-20"
            >
              <Image
                source={{ uri: pet.photoUrl || 'https://via.placeholder.com/80' }}
                className="w-16 h-16 rounded-full bg-gray-200 border-2 border-white shadow-sm"
              />
              <Text className="text-sm font-medium mt-1 text-text-main text-center" numberOfLines={1}>
                {pet.name}
              </Text>
              <Text className="text-xs text-text-muted text-center" numberOfLines={1}>
                {pet.breed || 'SRD'}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text className="text-text-muted italic text-sm py-2">
          Nenhum pet cadastrado ainda.
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 px-6 pt-4">
        {/* Cabeçalho da Tela */}
        <View className="mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-primary-700">Meus Pacientes</Text>
            <Text className="text-text-muted">Lista de tutores vinculados.</Text>
          </View>
          {/* Botão de reload manual opcional */}
          <TouchableOpacity
            onPress={fetchClients}
            className="bg-secondary-100 p-2 rounded-full"
          >
            <Ionicons name="reload" size={20} color="#047857" />
          </TouchableOpacity>
        </View>

        {/* Lista Principal */}
        <FlatList
          data={clients}
          keyExtractor={item => item.id}
          renderItem={renderClient}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchClients}
              colors={['#10B981']} // Cor do spinner no Android
              tintColor="#10B981"  // Cor do spinner no iOS
            />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center justify-center mt-20 px-8">
              <Ionicons name="people-outline" size={64} color="#D1FAE5" />
              <Text className="text-lg font-bold text-primary-700 mt-4 text-center">
                Sua lista está vazia
              </Text>
              <Text className="text-text-muted text-center mt-2">
                Compartilhe seu Token de Vinculação com seus clientes para que eles apareçam aqui.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}