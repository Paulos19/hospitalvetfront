import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../../src/services/api';
// Importação correta do SafeAreaView
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. Definimos a interface do Pet
interface Pet {
  id: string;
  name: string;
  breed: string | null;
  weight: number | null;
  photoUrl: string | null;
}

export default function ClientHome() {
  // 2. Aplicamos a tipagem no useState
  const [pets, setPets] = useState<Pet[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  async function fetchPets() {
    try {
      setRefreshing(true);
      const res = await api.get('/pets');
      setPets(res.data);
    } catch (error) {
      console.log('Erro ao buscar pets');
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchPets(); }, []);

  // 3. Tipamos o item desestruturado
  const renderPet = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/(client)/pet/[id]', // Link para a nova tela
        params: { id: item.id }
      })}
      className="bg-white p-4 rounded-2xl mb-4 flex-row items-center shadow-sm border border-gray-100"
    >
      <View className="ml-4 flex-1">
        <Text className="text-lg font-bold text-primary-700">{item.name}</Text>
        <Text className="text-text-muted">{item.breed || 'Sem raça'} • {item.weight || 0}kg</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#10B981" />
    </TouchableOpacity>
  );

  return (
    // Usando SafeAreaView para evitar o notch
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 px-6 pt-4">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-primary-700">Olá, Tutor!</Text>
            <Text className="text-text-muted">Cuide bem dos seus amigos.</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(client)/new-pet')}
            className="bg-primary-500 w-12 h-12 rounded-full items-center justify-center shadow-lg shadow-primary-500/30"
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={pets}
          keyExtractor={item => item.id}
          renderItem={renderPet}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPets} />}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Text className="text-4xl">🐶</Text>
              <Text className="text-text-muted mt-4 text-center">Nenhum pet encontrado.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}