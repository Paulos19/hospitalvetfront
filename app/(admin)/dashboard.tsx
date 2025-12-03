import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Clipboard, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';

interface Vet {
  id: string;
  name: string;
  email: string;
  crmv: string;
  inviteToken: string;
}

export default function AdminDashboard() {
  const [vets, setVets] = useState<Vet[]>([]);
  const router = useRouter();

  async function fetchVets() {
    try {
      // Nota: Precisaremos garantir que essa rota exista no backend
      const res = await api.get('/admin/vets');
      setVets(res.data);
    } catch (error) {
      console.log('Erro ao buscar veterinários');
    }
  }

  useEffect(() => { fetchVets(); }, []);

  const copyToken = (token: string) => {
    Clipboard.setString(token);
    Alert.alert('Copiado!', `Token ${token} pronto para envio.`);
  };

  const renderVet = ({ item }: { item: Vet }) => (
    <View className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-lg font-bold text-primary-700">{item.name}</Text>
          <Text className="text-text-muted text-sm">{item.email}</Text>
          <Text className="text-text-muted text-xs mt-1">CRMV: {item.crmv || 'N/A'}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => copyToken(item.inviteToken)}
          className="bg-secondary-100 px-3 py-1 rounded-lg border border-primary-500 border-dashed"
        >
          <Text className="text-primary-700 font-bold text-xs">COPIAR TOKEN</Text>
        </TouchableOpacity>
      </View>
      <View className="mt-2 bg-gray-50 p-2 rounded flex-row items-center">
        <Ionicons name="key-outline" size={14} color="#6B7280" />
        <Text className="text-text-muted text-xs ml-2 font-mono">{item.inviteToken}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 px-6 pt-4">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-primary-700">Administração</Text>
            <Text className="text-text-muted">Gerencie o corpo clínico.</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/(admin)/create-vet')}
            className="bg-primary-700 w-12 h-12 rounded-full items-center justify-center shadow-lg"
          >
            <Ionicons name="person-add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <FlatList 
          data={vets}
          keyExtractor={item => item.id}
          renderItem={renderVet}
          ListEmptyComponent={
            <Text className="text-center text-text-muted mt-10">Nenhum veterinário cadastrado.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}