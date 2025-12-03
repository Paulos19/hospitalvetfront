import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../src/services/api';

export default function ClientPetDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Reutilizamos a rota GET /vet/pet/[id] pois ela retorna tudo e o cliente tem permissão de leitura
  // Nota: Idealmente, teríamos uma rota /client/pet/[id] para segurança estrita,
  // mas se o backend checar apenas token válido, funciona. 
  // Caso dê erro 401, precisaremos duplicar a rota no backend para /client/...
  async function fetchDetails() {
    try {
      // Vamos tentar usar a mesma rota. Se seu backend bloquear por ROLE, avise.
      // O ideal é criar app/api/client/pet/[id] no backend com lógica similar.
      const res = await api.get(`/vet/pet/${id}`); 
      setPet(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchDetails(); }, [id]);

  if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator color="#10B981"/></View>;
  if (!pet) return <View className="flex-1 justify-center items-center"><Text>Pet não encontrado</Text></View>;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView>
        {/* Header com Foto Gigante */}
        <View className="relative">
          <Image 
            source={{ uri: pet.photoUrl || 'https://via.placeholder.com/400' }} 
            className="w-full h-64 bg-gray-300"
          />
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="absolute top-4 left-4 bg-white/80 p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-20">
            <Text className="text-3xl font-bold text-white">{pet.name}</Text>
            <Text className="text-white opacity-90">{pet.breed} • {pet.weight}kg</Text>
          </View>
        </View>

        <View className="px-6 py-6">
          {/* Carteira de Vacinação */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text className="text-lg font-bold text-primary-700 ml-2">Vacinas</Text>
            </View>

            {pet.vaccinations.length === 0 ? (
              <Text className="text-text-muted italic">Nenhuma vacina registrada.</Text>
            ) : (
              pet.vaccinations.map((vac: any) => (
                <View key={vac.id} className="bg-white p-4 rounded-xl mb-3 flex-row justify-between items-center shadow-sm">
                  <View>
                    <Text className="font-bold text-text-main">{vac.name}</Text>
                    <Text className="text-xs text-text-muted">Aplicada: {new Date(vac.dateAdministered).toLocaleDateString('pt-BR')}</Text>
                  </View>
                  {vac.nextDueDate && (
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                      <Text className="text-xs text-green-700 font-bold">
                        Vence: {new Date(vac.nextDueDate).toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>

          {/* Receitas / Histórico */}
          <View>
            <View className="flex-row items-center mb-4">
              <Ionicons name="document-text" size={20} color="#10B981" />
              <Text className="text-lg font-bold text-primary-700 ml-2">Receitas & Laudos</Text>
            </View>

            {pet.prescriptions.length === 0 ? (
              <Text className="text-text-muted italic">Nenhum histórico disponível.</Text>
            ) : (
              pet.prescriptions.map((presc: any) => (
                <View key={presc.id} className="bg-white p-4 rounded-xl mb-4 border-l-4 border-primary-500 shadow-sm">
                  <Text className="font-bold text-lg text-primary-700 mb-1">{presc.title}</Text>
                  <Text className="text-xs text-text-muted mb-2">{new Date(presc.issuedAt).toLocaleDateString('pt-BR')}</Text>
                  <Text className="text-text-main leading-5">{presc.description}</Text>
                  
                  {presc.medications && (
                    <View className="mt-3 pt-3 border-t border-gray-100">
                      <Text className="text-xs font-bold text-gray-500 mb-1">PRESCRIÇÃO:</Text>
                      <Text className="text-sm font-medium text-text-main">{presc.medications}</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}