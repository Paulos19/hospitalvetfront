import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PetCard } from '../../components/home/PetCard';
import { ScreenBackground } from '../../components/ui/ScreenBackground';
import { Skeleton } from '../../components/ui/Skeleton';
import { api } from '../../src/services/api';
import { useAuthStore } from '../../src/store/authStore';

// Função auxiliar de idade (mantida)
function getAge(birthDateString?: string) {
    if (!birthDateString) return null;
    const birth = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    if (age === 0) {
        const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
        return `${months} meses`;
    }
    return `${age} anos`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchPets() {
    try {
      const response = await api.get('/pets');
      setPets(response.data);
    } catch (error) {
      console.log('Erro ao buscar pets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [])
  );

  return (
    <ScreenBackground>
      <SafeAreaView className="flex-1">
        <ScrollView 
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPets(); }} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Header Reformulado (Mais Destaque) */}
          <View className="px-6 pt-6 mb-8 flex-row justify-between items-start">
            <View>
              <Text className="text-gray-400 text-lg font-medium mb-1">
                Olá, <Text className="text-gray-800 font-bold">{user?.name?.split(' ')[0]}</Text> 👋
              </Text>
              <View className="flex-row items-baseline">
                <Text className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    HVG
                </Text>
                <Text className="text-3xl font-light text-emerald-600 ml-2">
                    Cães & Cia
                </Text>
              </View>
            </View>
            
            <TouchableOpacity className="mt-1 bg-white p-3 rounded-2xl shadow-sm shadow-gray-200 border border-gray-100">
               <Ionicons name="notifications-outline" size={26} color="#374151" />
               <View className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </TouchableOpacity>
          </View>

          {/* 2. Seção Meus Pets */}
          <View className="mb-10">
             <View className="flex-row justify-between items-center px-6 mb-5">
                <Text className="text-xl font-bold text-gray-800">Meus Pets</Text>
                <TouchableOpacity 
                    onPress={() => router.push('/new-pet')}
                    className="flex-row items-center space-x-1"
                >
                    <Ionicons name="add-circle" size={20} color="#10B981" />
                    <Text className="text-emerald-600 font-bold text-sm">Novo Pet</Text>
                </TouchableOpacity>
             </View>
             
             {loading ? (
                <View className="px-6 flex-row gap-4">
                    <Skeleton className="w-72 h-48 rounded-[32px]" />
                    <Skeleton className="w-10 h-48 rounded-l-[32px]" />
                </View>
             ) : pets.length === 0 ? (
                <View className="px-6">
                     <TouchableOpacity 
                        onPress={() => router.push('/new-pet')}
                        className="bg-gray-50 p-8 rounded-[32px] items-center border-2 border-dashed border-gray-200"
                    >
                        <View className="bg-emerald-100 p-4 rounded-full mb-3">
                            <Ionicons name="paw" size={32} color="#10B981" />
                        </View>
                        <Text className="text-gray-600 font-bold text-lg">Cadastre seu amigo</Text>
                        <Text className="text-gray-400 text-center mt-1">
                            Tenha todo o histórico de saúde na palma da mão.
                        </Text>
                    </TouchableOpacity>
                </View>
             ) : (
                <FlatList
                    horizontal
                    data={pets}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24 }}
                    renderItem={({ item }) => (
                        <PetCard 
                            name={item.name} 
                            breed={item.breed}
                            age={getAge(item.birthDate)}
                            photoUrl={item.photoUrl}
                            onPress={() => router.push(`/pet/${item.id}`)}
                        />
                    )}
                />
             )}
          </View>

          {/* 3. Ações Rápidas (Grid Moderno) */}
          <View className="px-6 mb-10">
            <Text className="text-xl font-bold text-gray-800 mb-5">Acesso Rápido</Text>
            
            <View className="flex-row flex-wrap justify-between gap-y-4">
                <QuickAction 
                    icon="calendar" 
                    label="Agendar" 
                    subtitle="Consultas"
                    bg="bg-blue-50" 
                    iconColor="#3B82F6" 
                />
                <QuickAction 
                    icon="document-text" 
                    label="Receitas" 
                    subtitle="Histórico"
                    bg="bg-purple-50" 
                    iconColor="#A855F7" 
                />
                <QuickAction 
                    icon="shield-checkmark" 
                    label="Vacinas" 
                    subtitle="Carteirinha"
                    bg="bg-emerald-50" 
                    iconColor="#10B981" 
                />
                <QuickAction 
                    icon="chatbubble-ellipses" 
                    label="Contato" 
                    subtitle="Fale conosco"
                    bg="bg-orange-50" 
                    iconColor="#F97316" 
                />
            </View>
          </View>

          {/* 4. Banner Informativo (Estilo Glass) */}
          <View className="px-6">
            <View className="bg-gray-900 rounded-3xl p-6 flex-row items-center justify-between shadow-xl shadow-gray-900/20 overflow-hidden relative">
                {/* Efeito de fundo */}
                <View className="absolute -right-10 -top-10 w-40 h-40 bg-gray-800 rounded-full opacity-50" />
                
                <View className="flex-1 mr-4 z-10">
                    <View className="bg-emerald-500 self-start px-3 py-1 rounded-full mb-3">
                        <Text className="text-white text-[10px] font-bold uppercase">Dica do Vet</Text>
                    </View>
                    <Text className="text-white font-bold text-lg mb-1">Check-up Preventivo</Text>
                    <Text className="text-gray-400 text-sm leading-5">
                        Exames de rotina ajudam a prevenir doenças silenciosas. Agende!
                    </Text>
                </View>
                <View className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm z-10">
                    <Ionicons name="pulse" size={28} color="#10B981" />
                </View>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

// Componente Local de Ação Rápida Melhorado
function QuickAction({ icon, label, subtitle, bg, iconColor }: any) {
    return (
        <TouchableOpacity 
            activeOpacity={0.7}
            className="w-[48%] bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm shadow-gray-100 flex-row items-center"
        >
            <View className={`p-3 rounded-2xl ${bg} mr-3`}>
                <Ionicons name={icon} size={22} color={iconColor} />
            </View>
            <View className="flex-1">
                <Text className="font-bold text-gray-800 text-sm">{label}</Text>
                <Text className="text-gray-400 text-[10px] mt-0.5">{subtitle}</Text>
            </View>
        </TouchableOpacity>
    )
}