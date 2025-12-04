import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';

export default function CreateVetScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    crmv: '',
    specialty: '',
  });

  async function handleRegister() {
    // Validação básica do formulário no frontend
    if (!formData.name || !formData.email || !formData.password || !formData.crmv) {
        return Alert.alert('Atenção', 'Preencha todos os campos obrigatórios (Nome, E-mail, Senha, CRMV).');
    }
    
    setLoading(true);
    try {
      const response = await api.post('/admin/create-vet', formData);
      const newVet = response.data.vet;

      // Navega para a tela de sucesso, mostrando o token de convite
      router.replace({
        pathname: '/success',
        params: {
          title: 'Veterinário Cadastrado!',
          // Passamos o token gerado para a tela de sucesso exibir
          subtitle: `O código de convite é ${newVet.inviteToken}. O médico deverá usá-lo para vincular seus clientes.`,
          nextRoute: '/(admin)/dashboard',
          buttonText: 'Ir para o Dashboard'
        }
      });
      
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Erro ao cadastrar veterinário. Verifique os dados.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
          
          <View className="bg-white p-6 rounded-3xl mb-6 shadow-md border-t-4 border-emerald-500">
            <Text className="text-xl font-bold text-gray-800 mb-4 flex-row items-center">
                <Ionicons name="person-add-outline" size={24} color="#10B981" />
                <Text className="ml-2"> Novo Cadastro</Text>
            </Text>

            <Text className="font-bold text-gray-700 mb-2 mt-4 ml-1">Dados de Acesso</Text>
            <Input 
                placeholder="E-mail" 
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={t => setFormData({...formData, email: t})}
            />
            <Input 
                placeholder="Senha (Mín. 6 caracteres)" 
                icon="lock-closed-outline"
                isPassword
                value={formData.password}
                onChangeText={t => setFormData({...formData, password: t})}
            />

            <Text className="font-bold text-gray-700 mb-2 mt-4 ml-1">Dados Profissionais</Text>
            <Input 
                placeholder="Nome Completo" 
                icon="person-outline"
                value={formData.name}
                onChangeText={t => setFormData({...formData, name: t})}
            />
            <Input 
                placeholder="CRMV" 
                icon="id-card-outline"
                value={formData.crmv}
                onChangeText={t => setFormData({...formData, crmv: t})}
            />
            <Input 
                placeholder="Especialidade (Opcional)" 
                icon="bandage-outline"
                value={formData.specialty}
                onChangeText={t => setFormData({...formData, specialty: t})}
            />

            <Button
              title="Cadastrar Veterinário"
              onPress={handleRegister}
              loading={loading}
              className="mt-8 bg-emerald-500"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}