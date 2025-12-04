import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenBackground } from '../../../../components/ui/ScreenBackground';
import { api } from '../../../../src/services/api';

interface Vaccine {
  id: string;
  name: string;
  dateAdministered: string;
  nextDueDate?: string;
}

export default function VaccineScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVaccines();
  }, [id]);

  async function fetchVaccines() {
    try {
      const response = await api.get(`/pets/${id}/vaccines`);
      setVaccines(response.data);
    } catch (error) {
      console.log('Erro ao buscar vacinas');
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString?: string) {
    if (!dateString) return '--/--/----';
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  // Verifica se a vacina está atrasada
  function isOverdue(nextDate?: string) {
    if (!nextDate) return false;
    return new Date(nextDate) < new Date();
  }

  return (
    <ScreenBackground>
      <SafeAreaView className="flex-1">
        
        {/* Header Simples */}
        <View className="px-6 py-4 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="bg-white p-2 rounded-full shadow-sm border border-gray-100">
                 <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <View className="ml-4">
                <Text className="text-xl font-bold text-gray-800">Carteira de Vacinação</Text>
                <Text className="text-gray-400 text-xs">Histórico imunológico</Text>
            </View>
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#10B981" className="mt-10" />
        ) : vaccines.length === 0 ? (
            <View className="flex-1 items-center justify-center px-10">
                <View className="bg-emerald-50 p-6 rounded-full mb-4">
                    <Ionicons name="shield-checkmark-outline" size={48} color="#10B981" />
                </View>
                <Text className="text-gray-500 text-center text-lg font-medium">Nenhuma vacina registrada.</Text>
                <Text className="text-gray-400 text-center text-sm mt-2">
                    As vacinas aplicadas pelo seu veterinário aparecerão aqui automaticamente.
                </Text>
            </View>
        ) : (
            <FlatList
                data={vaccines}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 24, paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    const overdue = isOverdue(item.nextDueDate);
                    const isLast = index === vaccines.length - 1;

                    return (
                        <View className="flex-row">
                            {/* Linha do Tempo Visual */}
                            <View className="items-center mr-4">
                                <View className={`w-4 h-4 rounded-full border-[3px] bg-white z-10 ${overdue ? 'border-red-500' : 'border-emerald-500'}`} />
                                {!isLast && (
                                    <View className="w-[2px] flex-1 bg-gray-200 -my-1" />
                                )}
                            </View>

                            {/* Card da Vacina */}
                            <View className="flex-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
                                <View className="flex-row justify-between items-start mb-2">
                                    <Text className="text-lg font-bold text-gray-800 flex-1 mr-2">{item.name}</Text>
                                    <View className="bg-emerald-50 px-2 py-1 rounded-md">
                                        <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                                    </View>
                                </View>
                                
                                <View className="flex-row items-center mb-1">
                                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                                    <Text className="text-gray-500 text-sm ml-1">Aplicada em: {formatDate(item.dateAdministered)}</Text>
                                </View>

                                {item.nextDueDate && (
                                    <View className={`mt-3 p-3 rounded-xl flex-row items-center ${overdue ? 'bg-red-50' : 'bg-blue-50'}`}>
                                        <Ionicons 
                                            name={overdue ? "alert-circle" : "time-outline"} 
                                            size={18} 
                                            color={overdue ? "#EF4444" : "#3B82F6"} 
                                        />
                                        <View className="ml-2">
                                            <Text className={`text-xs font-bold uppercase ${overdue ? 'text-red-600' : 'text-blue-600'}`}>
                                                Próxima Dose
                                            </Text>
                                            <Text className={`font-bold ${overdue ? 'text-red-800' : 'text-blue-800'}`}>
                                                {formatDate(item.nextDueDate)}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                }}
            />
        )}
      </SafeAreaView>
    </ScreenBackground>
  );
}