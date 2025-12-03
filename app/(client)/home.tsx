import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';
import { useAuthStore } from '../../src/store/authStore';

// Import dos componentes customizados
import { AppointmentCard } from '../../components/home/AppointmentCard';
import { PetCard } from '../../components/home/PetCard';
// Certifique-se de ter criado o HomeSkeleton conforme a instrução anterior. 
// Se não tiver, pode remover essa importação e o bloco de loading abaixo.
import { HomeSkeleton } from '../../components/home/HomeSkeleton';

// Tipos
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
  const { user } = useAuthStore(); 
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true); // Estado para o Skeleton
  const router = useRouter();

  async function fetchData() {
    try {
      // Se não for refresh (pull to refresh), ativa o skeleton
      if (!refreshing) setLoadingInitial(true);

      const [petsRes, appRes] = await Promise.all([
        api.get('/pets'),
        api.get('/appointments') 
      ]);
      
      setPets(petsRes.data);
      setAppointments(appRes.data);
    } catch (error) {
      console.log('Erro ao buscar dados', error);
    } finally {
      setRefreshing(false);
      setLoadingInitial(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  // Header Component para o FlatList (para tudo rolar junto)
  const ListHeader = () => (
    <View className="mb-6">
        {/* Saudação e Botão de Adicionar */}
        <View className="flex-row justify-between items-center mb-8">
            <View>
                <Text className="text-gray-500 font-medium">Bem-vindo de volta,</Text>
                <Text className="text-2xl font-bold text-gray-800">
                    {user?.name?.split(' ')[0] || 'Tutor'}! 👋
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => router.push('/(client)/new-pet')}
                className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm border border-gray-100 active:bg-gray-50"
            >
                <Ionicons name="add" size={24} color="#10B981" />
            </TouchableOpacity>
        </View>

        {/* Seção de Agendamentos (Carrossel) */}
        {appointments.length > 0 ? (
            <View className="mb-8">
                <View className="flex-row justify-between items-end mb-4">
                    <Text className="text-xl font-bold text-gray-800">Próximas Consultas</Text>
                    {/* Botão ver todos (placeholder) */}
                    <TouchableOpacity>
                        <Text className="text-primary-500 font-bold text-xs">Ver todas</Text>
                    </TouchableOpacity>
                </View>
                
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 20 }}
                >
                    {appointments.map((app) => (
                        <AppointmentCard key={app.id} appointment={app} />
                    ))}
                </ScrollView>
            </View>
        ) : (
            // Estado vazio de agendamentos
            <View className="mb-8 bg-white p-6 rounded-3xl border border-gray-100 border-dashed items-center flex-row shadow-sm">
                <View className="bg-gray-50 p-3 rounded-full mr-4">
                    <Ionicons name="calendar-outline" size={24} color="#9CA3AF" />
                </View>
                <View className="flex-1">
                    <Text className="font-bold text-gray-700">Tudo tranquilo!</Text>
                    <Text className="text-gray-400 text-xs">Nenhuma consulta agendada para os próximos dias.</Text>
                </View>
            </View>
        )}

        <Text className="text-xl font-bold text-gray-800 mb-4">Meus Pets</Text>
    </View>
  );

  // Renderização do Skeleton enquanto carrega
  if (loadingInitial) {
    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
            {/* Certifique-se que HomeSkeleton existe. Se não, use um View simples */}
            <HomeSkeleton /> 
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      <FlatList
        data={pets}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <PetCard pet={item} index={index} />}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }} // Padding bottom extra por causa da TabBar flutuante
        ListHeaderComponent={ListHeader}
        refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={fetchData} 
                tintColor="#10B981" // Cor do loading iOS
                colors={['#10B981']} // Cor do loading Android
            />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center mt-4 py-10 bg-white rounded-3xl shadow-sm border border-gray-100">
            <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
                <Text className="text-4xl">🐶</Text>
            </View>
            <Text className="text-lg font-bold text-gray-800">Nenhum pet ainda</Text>
            <Text className="text-gray-400 text-center px-10 mt-2 text-sm leading-5">
                Cadastre seu primeiro amigo para começar a acompanhar a saúde dele.
            </Text>
            <TouchableOpacity 
                onPress={() => router.push('/(client)/new-pet')}
                className="mt-6 px-6 py-3 bg-primary-500 rounded-xl shadow-lg shadow-primary-500/30"
            >
                <Text className="text-white font-bold">Cadastrar Pet</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}