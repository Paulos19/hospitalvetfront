import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EditPetModal } from '../../../components/pet/EditPetModal';
import { ScreenBackground } from '../../../components/ui/ScreenBackground';
import { api } from '../../../src/services/api';
import { useAuthStore } from '../../../src/store/authStore';

export default function PetDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [pet, setPet] = useState<any>(null);
  const [vet, setVet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      // 1. Busca Pet específico pela nova rota de ID
      const petResponse = await api.get(`/pets/${id}`);
      setPet(petResponse.data);

      // 2. Busca Veterinário usando o ID vinculado ao usuário
      if (user?.myVetId) {
        try {
           const vetResponse = await api.get(`/users/${user.myVetId}`); 
           setVet(vetResponse.data);
        } catch (err) {
           console.log("Erro ao buscar vet:", err);
        }
      }

    } catch (error) {
      console.log('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [id, user?.myVetId])
  );

  function getAge(dateString: string) {
    if(!dateString) return '--';
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    
    return age === 0 ? `${m + (age < 0 ? 12 : 0)} meses` : `${age} anos`;
  }

  if (loading) return <ScreenBackground className="justify-center items-center"><ActivityIndicator size="large" color="#10B981" /></ScreenBackground>;
  if (!pet) return <ScreenBackground className="justify-center items-center"><Text>Pet não encontrado.</Text></ScreenBackground>;

  return (
    <ScreenBackground>
      <SafeAreaView className="flex-1">
        
        {/* Header Flutuante */}
        <View className="flex-row justify-between items-center px-6 pt-2 z-10 mb-2">
            <TouchableOpacity onPress={() => router.back()} className="bg-white p-2.5 rounded-full shadow-sm border border-gray-100">
                <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            
            <TouchableOpacity 
                onPress={() => setModalVisible(true)} 
                className="bg-white px-4 py-2.5 rounded-full border border-gray-200 shadow-sm flex-row items-center space-x-2"
            >
                <Ionicons name="settings-outline" size={18} color="#4B5563" />
                <Text className="text-gray-700 font-bold text-xs uppercase tracking-wide">Editar</Text>
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            
            {/* 1. Área Hero (Foto, Nome, Raça) */}
            <View className="items-center mt-2 mb-10">
                <View className="relative mb-5">
                    <View className="w-44 h-44 rounded-full border-[6px] border-white shadow-2xl shadow-emerald-500/30 bg-gray-100 items-center justify-center overflow-hidden">
                        {pet.photoUrl ? (
                            <Image source={{ uri: pet.photoUrl }} className="w-full h-full" />
                        ) : (
                            <Ionicons name="paw" size={80} color="#E5E7EB" />
                        )}
                    </View>
                    {/* Badge de Sexo Dinâmica */}
                    <View className={`absolute bottom-1 right-1 p-3 rounded-full border-[4px] border-white ${pet.sex === 'FEMEA' ? 'bg-pink-500' : 'bg-blue-500'}`}>
                        <Ionicons name={pet.sex === 'FEMEA' ? 'female' : 'male'} size={22} color="white" />
                    </View>
                </View>

                <Text className="text-4xl font-extrabold text-slate-800 tracking-tight text-center px-4">
                    {pet.name}
                </Text>
                <View className="flex-row items-center mt-2 bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                    <Text className="text-gray-500 font-bold text-sm uppercase tracking-wide">
                        {pet.breed || 'Sem Raça'} • {getAge(pet.birthDate)}
                    </Text>
                </View>
            </View>

            {/* 2. Stats Grid (Peso, Sexo, Nascimento) */}
            <View className="flex-row justify-center px-6 gap-4 mb-10">
                <StatBox 
                    label="Peso Atual" 
                    value={`${pet.weight || '--'} kg`} 
                    icon="scale-outline" 
                    color="text-emerald-600" 
                    bg="bg-emerald-50" 
                />
                <StatBox 
                    label="Sexo" 
                    value={pet.sex === 'FEMEA' ? 'Fêmea' : 'Macho'} 
                    icon={pet.sex === 'FEMEA' ? 'female' : 'male'}
                    color={pet.sex === 'FEMEA' ? 'text-pink-600' : 'text-blue-600'} 
                    bg={pet.sex === 'FEMEA' ? 'bg-pink-50' : 'bg-blue-50'}
                />
                <StatBox 
                    label="Aniversário" 
                    value={pet.birthDate ? new Date(pet.birthDate).toLocaleDateString('pt-BR').slice(0,5) : '--/--'} 
                    icon="gift-outline" 
                    color="text-orange-600" 
                    bg="bg-orange-50" 
                />
            </View>

            {/* 3. Card do Veterinário Responsável */}
            <View className="px-6 mb-10">
                <Text className="text-xl font-bold text-gray-800 mb-4 ml-1">Equipe Responsável</Text>
                
                {user?.myVetId && vet ? (
                    <View className="bg-slate-800 rounded-[28px] p-6 shadow-xl shadow-slate-900/20 relative overflow-hidden">
                        <View className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
                        <View className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/20 rounded-full -ml-8 -mb-8 blur-xl" />

                        <View className="flex-row items-center relative z-10">
                            <View className="w-14 h-14 bg-slate-700 rounded-2xl items-center justify-center border border-slate-600 mr-4 shadow-lg overflow-hidden">
                                {vet.photoUrl ? (
                                    <Image source={{ uri: vet.photoUrl }} className="w-full h-full" />
                                ) : (
                                    <Ionicons name="medkit" size={28} color="#34D399" />
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-lg leading-tight">
                                    {vet.name}
                                </Text>
                                <Text className="text-slate-400 text-sm font-medium mt-0.5">
                                    {vet.specialty || 'Médico Veterinário'}
                                </Text>
                            </View>
                        </View>

                        <View className="mt-6 pt-4 border-t border-slate-700/50 flex-row justify-between items-center">
                             <Text className="text-slate-400 text-xs">CRMV: {vet.crmv || '---'}</Text>
                             <TouchableOpacity className="flex-row items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-lg active:bg-white/20">
                                <Ionicons name="chatbubble-ellipses-outline" size={16} color="white" />
                                <Text className="text-white text-xs font-bold">Contato</Text>
                             </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity 
                        onPress={() => router.push('/link-vet')}
                        className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-[24px] p-6 items-center justify-center"
                    >
                         <Ionicons name="link-outline" size={32} color="#9CA3AF" />
                         <Text className="text-gray-500 font-bold mt-2">Vincular Veterinário</Text>
                         <Text className="text-gray-400 text-xs text-center mt-1">Conecte-se para compartilhar o histórico</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* 4. Prontuário Digital (Links para Vacinas, Receitas, etc) */}
            <View className="px-6">
                <Text className="text-xl font-bold text-gray-800 mb-5 ml-1">Prontuário Digital</Text>
                
                <View className="space-y-4">
                    <ClinicalRow 
                        icon="shield-checkmark" 
                        color="bg-emerald-100" 
                        iconColor="#059669"
                        title="Vacinas" 
                        subtitle="Carteira de vacinação digital"
                        onPress={() => router.push(`/(client)/pet/${id}/vaccines`)}
                    />
                     <ClinicalRow 
                        icon="document-text" 
                        color="bg-blue-100" 
                        iconColor="#2563EB"
                        title="Receitas & Exames" 
                        subtitle="Histórico de prescrições"
                        onPress={() => router.push(`/(client)/pet/${id}/prescriptions`)} // Já apontando para a Fase 2
                    />
                     <ClinicalRow 
                        icon="calendar" 
                        color="bg-orange-100" 
                        iconColor="#EA580C"
                        title="Consultas" 
                        subtitle="Agenda e retornos"
                        // Fase 3
                        onPress={() => alert('Em breve')} 
                    />
                </View>
            </View>

        </ScrollView>

        {/* Modal de Edição */}
        <EditPetModal 
            visible={modalVisible} 
            pet={pet} 
            onClose={() => setModalVisible(false)} 
            onSave={fetchData} 
        />

      </SafeAreaView>
    </ScreenBackground>
  );
}

// Subcomponentes Visuais
function StatBox({ label, value, icon, color, bg }: any) {
    return (
        <View className="flex-1 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 items-center justify-center min-h-[110px]">
            <View className={`p-2.5 rounded-xl ${bg} mb-3`}>
                <Ionicons name={icon} size={20} className={color} style={{ color: color.includes('pink') ? '#EC4899' : color.includes('blue') ? '#2563EB' : color.includes('orange') ? '#EA580C' : '#059669' }} /> 
            </View>
            <Text className="text-gray-800 font-extrabold text-sm text-center" numberOfLines={1}>{value}</Text>
            <Text className="text-gray-400 text-[10px] uppercase font-bold mt-1">{label}</Text>
        </View>
    )
}

function ClinicalRow({ icon, color, iconColor, title, subtitle, onPress }: any) {
    return (
        <TouchableOpacity 
            onPress={onPress}
            className="flex-row items-center bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm active:bg-gray-50 active:scale-[0.98] transition-all"
        >
            <View className={`w-14 h-14 ${color} rounded-2xl items-center justify-center mr-5`}>
                <Ionicons name={icon} size={26} color={iconColor} />
            </View>
            <View className="flex-1">
                <Text className="text-gray-800 font-bold text-base">{title}</Text>
                <Text className="text-gray-400 text-xs mt-0.5">{subtitle}</Text>
            </View>
            <View className="bg-gray-50 p-2 rounded-full">
                 <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </View>
        </TouchableOpacity>
    )
}