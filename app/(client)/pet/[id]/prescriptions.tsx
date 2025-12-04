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

interface Prescription {
  id: string;
  title: string;
  description: string;
  medications: string; // JSON string ou texto
  issuedAt: string;
}

export default function PrescriptionsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrescriptions();
  }, [id]);

  async function fetchPrescriptions() {
    try {
      const response = await api.get(`/pets/${id}/prescriptions`);
      setPrescriptions(response.data);
    } catch (error) {
      console.log('Erro ao buscar receitas');
    } finally {
      setLoading(false);
    }
  }

  function toggleExpand(pId: string) {
    setExpandedId(expandedId === pId ? null : pId);
  }

  return (
    <ScreenBackground>
      <SafeAreaView className="flex-1">
        
        <View className="px-6 py-4 flex-row items-center border-b border-gray-100/50">
            <TouchableOpacity onPress={() => router.back()} className="bg-white p-2 rounded-full shadow-sm border border-gray-100">
                 <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <View className="ml-4">
                <Text className="text-xl font-bold text-gray-800">Receitas & Exames</Text>
                <Text className="text-gray-400 text-xs">Histórico médico</Text>
            </View>
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#3B82F6" className="mt-10" />
        ) : prescriptions.length === 0 ? (
            <View className="flex-1 items-center justify-center px-10">
                <View className="bg-blue-50 p-6 rounded-full mb-4">
                    <Ionicons name="document-text-outline" size={48} color="#3B82F6" />
                </View>
                <Text className="text-gray-500 text-center text-lg font-medium">Nenhuma receita encontrada.</Text>
            </View>
        ) : (
            <FlatList
                data={prescriptions}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 24, paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const isExpanded = expandedId === item.id;
                    const date = new Date(item.issuedAt).toLocaleDateString('pt-BR');

                    return (
                        <TouchableOpacity 
                            activeOpacity={0.9}
                            onPress={() => toggleExpand(item.id)}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden"
                        >
                            {/* Cabeçalho do Card */}
                            <View className="p-5 flex-row items-start">
                                <View className="bg-blue-50 w-12 h-12 rounded-xl items-center justify-center mr-4">
                                    <Ionicons name="medical" size={24} color="#3B82F6" />
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-start">
                                        <Text className="text-gray-800 font-bold text-lg flex-1 mr-2">{item.title}</Text>
                                        <Text className="text-gray-400 text-xs font-medium mt-1">{date}</Text>
                                    </View>
                                    <Text className="text-gray-500 text-sm mt-1" numberOfLines={isExpanded ? undefined : 1}>
                                        {item.description}
                                    </Text>
                                </View>
                            </View>

                            {/* Área Expandida (Detalhes dos Medicamentos) */}
                            {isExpanded && (
                                <View className="bg-gray-50 px-5 py-4 border-t border-gray-100">
                                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        Medicamentos / Detalhes
                                    </Text>
                                    <Text className="text-gray-700 text-sm leading-6">
                                        {/* Tenta fazer parse se for JSON ou exibe texto puro */}
                                        {formatMedications(item.medications)}
                                    </Text>
                                    
                                    <View className="mt-4 flex-row justify-end">
                                        <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
                                            <Ionicons name="download-outline" size={16} color="#4B5563" />
                                            <Text className="text-gray-600 text-xs font-bold ml-2">PDF (Simulado)</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            
                            {/* Ícone de Expandir */}
                            <View className="w-full h-1 bg-gray-50 items-center justify-center">
                                 {!isExpanded && <Ionicons name="chevron-down" size={12} color="#D1D5DB" />}
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        )}
      </SafeAreaView>
    </ScreenBackground>
  );
}

// Helper simples para formatar o texto dos remédios
function formatMedications(meds: string) {
    try {
        const parsed = JSON.parse(meds);
        if (Array.isArray(parsed)) {
            return parsed.map((m: any) => `• ${m.name} (${m.dosage})`).join('\n');
        }
        return meds;
    } catch (e) {
        return meds;
    }
}