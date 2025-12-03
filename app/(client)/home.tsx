import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';

interface Pet {
  id: string;
  name: string;
  breed: string | null;
  weight: number | null;
  photoUrl: string | null;
}

interface Appointment {
  id: string;
  date: string;
  reason: string;
  pet: { name: string };
  doctor: { name: string };
}

export default function ClientHome() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  async function fetchData() {
    try {
      setRefreshing(true);
      // Buscamos ambos em paralelo
      const [petsRes, appRes] = await Promise.all([
        api.get('/pets'),
        api.get('/appointments')
      ]);
      
      setPets(petsRes.data);
      setAppointments(appRes.data);
    } catch (error) {
      console.log('Erro ao buscar dados');
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  const renderPet = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/(client)/pet/[id]',
        params: { id: item.id }
      })}
      className="bg-white p-4 rounded-2xl mb-4 flex-row items-center shadow-sm border border-gray-100"
    >
      <Image 
        source={{ uri: item.photoUrl || 'https://via.placeholder.com/100' }} 
        style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#E5E7EB' }}
        resizeMode="cover"
      />
      <View className="ml-4 flex-1">
        <Text className="text-lg font-bold text-primary-700">{item.name}</Text>
        <Text className="text-text-muted">{item.breed || 'Sem raça'} • {item.weight || 0}kg</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#10B981" />
    </TouchableOpacity>
  );

  return (
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

        {/* Seção de Agendamentos */}
        {appointments.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-primary-700 mb-3">Próximos Agendamentos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {appointments.map((app) => (
                    <View key={app.id} className="bg-primary-500 p-4 rounded-xl mr-4 w-72 shadow-md shadow-primary-500/20">
                        <View className="flex-row justify-between items-start mb-3">
                            <View>
                                <Text className="text-white font-bold text-xl">
                                    {new Date(app.date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
                                </Text>
                                <Text className="text-white/80 text-sm">
                                    {new Date(app.date).toLocaleDateString('pt-BR', {weekday: 'long'})}
                                </Text>
                            </View>
                            <View className="bg-white/20 px-3 py-1 rounded-lg">
                                <Text className="text-white font-bold">
                                    {new Date(app.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                </Text>
                            </View>
                        </View>
                        
                        <View className="bg-white/10 p-2 rounded-lg mb-2">
                            <Text className="text-white/90 font-medium text-xs uppercase tracking-wider">Paciente</Text>
                            <Text className="text-white font-bold text-lg">🐾 {app.pet.name}</Text>
                        </View>
                        
                        <Text className="text-white/90 text-sm mt-1" numberOfLines={1}>
                           Motivo: {app.reason}
                        </Text>
                        <Text className="text-white/70 text-xs mt-1">
                           Dr(a). {app.doctor.name}
                        </Text>
                    </View>
                ))}
            </ScrollView>
          </View>
        )}

        <Text className="text-lg font-bold text-primary-700 mb-3">Meus Pets</Text>
        <FlatList
          data={pets}
          keyExtractor={item => item.id}
          renderItem={renderPet}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
          ListEmptyComponent={
            <View className="items-center mt-10">
              <Text className="text-4xl">🐶</Text>
              <Text className="text-text-muted mt-4 text-center">Nenhum pet encontrado.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}