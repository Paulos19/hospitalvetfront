import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Image } from '@/components/ui/Image';
import { api } from '@/src/services/api';

interface VetDetails {
  id: string;
  name: string;
  email: string;
  crmv: string | null;
  specialty: string | null;
  photoUrl: string | null;
  inviteToken: string | null;
  createdAt: string;
  _count?: {
    patients: number;
  }
}

export default function AdminVetDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [vet, setVet] = useState<VetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para o Modal de Senha
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    fetchVetDetails();
  }, [id]);

  async function fetchVetDetails() {
    try {
      const response = await api.get(`/admin/vets/${id}`);
      setVet(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePassword() {
    if (newPassword.length < 6) {
      return Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
    }

    setLoadingPassword(true);
    try {
      await api.patch(`/admin/vets/${id}`, { password: newPassword });
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      setNewPassword('');
      setIsPasswordModalOpen(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar a senha.');
    } finally {
      setLoadingPassword(false);
    }
  }

  async function handleDelete() {
    Alert.alert(
      'Remover Veterinário',
      'Tem a certeza? Esta ação apagará todos os dados vinculados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/admin/vets/${id}`);
              Alert.alert('Sucesso', 'Veterinário removido.');
              router.replace('/(admin)/dashboard');
            } catch (error) {
              Alert.alert('Erro', 'Falha ao remover veterinário.');
            }
          }
        }
      ]
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  if (!vet) return null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800 ml-2">Perfil do Veterinário</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Card Principal */}
        <View className="bg-white p-6 rounded-2xl shadow-sm items-center mb-6">
          <Image 
            source={{ uri: vet.photoUrl || 'https://ui-avatars.com/api/?name=' + vet.name }} 
            className="w-24 h-24 rounded-full mb-4 bg-gray-200"
          />
          <Text className="text-2xl font-bold text-gray-800 text-center">{vet.name}</Text>
          <Text className="text-emerald-600 font-medium">{vet.specialty || 'Clínico Geral'}</Text>
          <Text className="text-gray-500 text-sm mt-1">{vet.email}</Text>
        </View>

        {/* Estatísticas e Informações */}
        <View className="bg-white p-5 rounded-2xl shadow-sm mb-6">
          <Text className="text-gray-800 font-bold mb-4 text-base">Dados Profissionais</Text>
          
          <InfoRow label="CRMV" value={vet.crmv || 'Não informado'} icon="card-outline" />
          <InfoRow label="Código de Convite" value={vet.inviteToken || '-'} icon="qr-code-outline" copyable />
          <InfoRow 
            label="Pacientes Ativos" 
            value={vet._count?.patients?.toString() || '0'} 
            icon="paw-outline" 
          />
          <InfoRow 
            label="Registrado em" 
            value={new Date(vet.createdAt).toLocaleDateString('pt-BR')} 
            icon="calendar-outline" 
          />
        </View>

        {/* Zona de Segurança / Ações */}
        <View className="mb-10">
          <Text className="text-gray-500 font-bold mb-3 ml-1 uppercase text-xs">Segurança</Text>
          
          <TouchableOpacity 
            onPress={() => setIsPasswordModalOpen(true)}
            className="bg-white p-4 rounded-xl shadow-sm flex-row items-center justify-between mb-3 border border-gray-100"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center mr-3">
                <Ionicons name="key-outline" size={18} color="#EA580C" />
              </View>
              <Text className="text-gray-700 font-medium">Redefinir Senha</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleDelete}
            className="bg-red-50 p-4 rounded-xl border border-red-100 flex-row items-center justify-center"
          >
            <Ionicons name="trash-outline" size={20} color="#DC2626" />
            <Text className="text-red-600 font-bold ml-2">Excluir Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Troca de Senha */}
      <Modal
        visible={isPasswordModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPasswordModalOpen(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full p-6 rounded-2xl">
            <Text className="text-xl font-bold text-gray-800 mb-2">Nova Senha</Text>
            <Text className="text-gray-500 mb-6 text-sm">
              Defina uma nova senha para o Dr. {vet.name.split(' ')[0]}.
            </Text>

            <TextInput
              className="bg-gray-100 p-4 rounded-xl mb-6 text-gray-800 border border-gray-200"
              placeholder="Digite a nova senha"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <View className="flex-row gap-3">
              <TouchableOpacity 
                onPress={() => {
                  setIsPasswordModalOpen(false);
                  setNewPassword('');
                }}
                className="flex-1 py-3 bg-gray-100 rounded-xl items-center"
              >
                <Text className="text-gray-600 font-bold">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleUpdatePassword}
                disabled={loadingPassword}
                className="flex-1 py-3 bg-emerald-600 rounded-xl items-center"
              >
                {loadingPassword ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white font-bold">Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

function InfoRow({ label, value, icon, copyable }: { label: string, value: string, icon: any, copyable?: boolean }) {
  return (
    <View className="flex-row items-center py-3 border-b border-gray-50 last:border-0">
      <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mr-3">
        <Ionicons name={icon} size={20} color="#059669" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-400 text-xs">{label}</Text>
        <Text className="text-gray-800 font-medium text-base" selectable={copyable}>{value}</Text>
      </View>
    </View>
  );
}