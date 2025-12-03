import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';
import { useAuthStore } from '../../src/store/authStore';

// Componente criado acima
import { Image } from '@/components/ui/Image';
import { ClientCard } from '../../components/vet/ClientCard';

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
  const { user } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  async function fetchClients() {
    setRefreshing(true);
    try {
      const res = await api.get('/vet/clients');
      setClients(res.data);
      setFilteredClients(res.data);
    } catch (error) {
      console.log('Erro ao buscar pacientes');
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchClients(); }, []);

  // Lógica de busca local
  function handleSearch(text: string) {
    setSearch(text);
    if (!text) {
        setFilteredClients(clients);
        return;
    }
    const lowerText = text.toLowerCase();
    const filtered = clients.filter(client => 
        client.name.toLowerCase().includes(lowerText) ||
        client.pets.some(p => p.name.toLowerCase().includes(lowerText))
    );
    setFilteredClients(filtered);
  }

  const Header = () => (
    <View className="mb-6">
        {/* Topo */}
        <View className="flex-row justify-between items-center mb-6">
            <View>
                <Text className="text-gray-500 font-medium text-xs uppercase tracking-wider">Veterinário</Text>
                <Text className="text-2xl font-bold text-primary-700">
                    Dr(a). {user?.name?.split(' ')[0] || 'Silva'}
                </Text>
            </View>
            <TouchableOpacity 
                onPress={() => router.push('/(vet)/profile')}
                className="w-10 h-10 bg-white rounded-full border border-gray-200 items-center justify-center shadow-sm"
            >
                {user?.photoUrl ? (
                    <Image source={{ uri: user.photoUrl }} className="w-full h-full rounded-full" />
                ) : (
                    <Ionicons name="person" size={20} color="#10B981" />
                )}
            </TouchableOpacity>
        </View>

        {/* Estatísticas Rápidas (Mock visual) */}
        <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-primary-500 p-4 rounded-2xl shadow-md shadow-primary-500/20">
                <Text className="text-white/80 text-xs font-medium">Pacientes</Text>
                <Text className="text-white text-2xl font-bold">{clients.reduce((acc, c) => acc + c.pets.length, 0)}</Text>
            </View>
            <View className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <Text className="text-gray-400 text-xs font-medium">Tutores</Text>
                <Text className="text-gray-800 text-2xl font-bold">{clients.length}</Text>
            </View>
        </View>

        {/* Barra de Busca */}
        <View className="bg-white flex-row items-center px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput 
                className="flex-1 ml-3 text-base text-gray-700"
                placeholder="Buscar tutor ou pet..."
                value={search}
                onChangeText={handleSearch}
                placeholderTextColor="#9CA3AF"
            />
            {search.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')}>
                    <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
            )}
        </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      <FlatList
        data={filteredClients}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <ClientCard client={item} index={index} />}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        ListHeaderComponent={Header}
        refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={fetchClients}
                colors={['#10B981']}
                tintColor="#10B981"
            />
        }
        ListEmptyComponent={
            <View className="items-center py-10">
                <Text className="text-gray-400">Nenhum paciente encontrado.</Text>
            </View>
        }
      />
    </SafeAreaView>
  );
}