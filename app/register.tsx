import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'; // <--- Image importada
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../src/services/api';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    vetToken: ''
  });

  async function handleRegister() {
    if (!formData.name || !formData.email || !formData.password || !formData.vetToken) {
        return Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
    }
    
    setLoading(true);
    try {
      await api.post('/auth/register-client', formData);
      
      router.replace({
        pathname: '/success',
        params: {
          title: 'Cadastro Concluído!',
          subtitle: 'Sua conta foi criada e vinculada. Faça login para começar a cuidar dos seus pets.',
          nextRoute: '/', // Rota de Login (index.tsx)
          buttonText: 'Ir para o Login'
        }
      });
      
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Erro ao criar conta';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <View className="px-6 py-4 flex-row items-center border-b border-gray-50">
            <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-50 rounded-xl mr-4">
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View>
                <Text className="text-xl font-bold text-gray-900">Criar Conta</Text>
                <Text className="text-gray-500 text-xs">Junte-se à nossa comunidade</Text>
            </View>
        </View>

        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
            
            {/* LOGO ADICIONADA */}
            <View className="items-center mb-6">
                <Image 
                    source={require('../assets/images/logo-hvg.png')} 
                    className="w-56 h-56" 
                    resizeMode="contain"
                />
            </View>

            <Animated.View entering={FadeInDown.duration(600).springify()}>
                
                <Text className="font-bold text-gray-700 mb-2 ml-1">Dados Pessoais</Text>
                <Input 
                    placeholder="Nome Completo" 
                    icon="person-outline"
                    value={formData.name}
                    onChangeText={t => setFormData({...formData, name: t})}
                />
                <Input 
                    placeholder="CPF (apenas números)" 
                    icon="id-card-outline"
                    keyboardType="numeric"
                    value={formData.cpf}
                    onChangeText={t => setFormData({...formData, cpf: t})}
                />
                <Input 
                    placeholder="E-mail" 
                    icon="mail-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={t => setFormData({...formData, email: t})}
                />
                <Input 
                    placeholder="Criar Senha" 
                    icon="lock-closed-outline"
                    isPassword
                    value={formData.password}
                    onChangeText={t => setFormData({...formData, password: t})}
                />

                {/* Seção Especial: Vínculo Médico */}
                <Animated.View 
                    entering={FadeInRight.delay(300).springify()}
                    className="mt-4 mb-8 bg-emerald-50 p-6 rounded-3xl border border-emerald-100 border-dashed relative overflow-hidden"
                >
                    {/* Elementos decorativos de fundo */}
                    <View className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-100 rounded-full opacity-50" />
                    
                    <View className="flex-row items-center mb-3">
                        <View className="bg-white p-2 rounded-full mr-3 shadow-sm">
                            <Ionicons name="medical" size={20} color="#10B981" />
                        </View>
                        <View>
                            <Text className="font-bold text-emerald-900 text-lg">Vínculo Médico</Text>
                            <Text className="text-emerald-700 text-xs">Obrigatório para o cadastro</Text>
                        </View>
                    </View>
                    
                    <Text className="text-emerald-800/70 text-sm mb-4 leading-5">
                        Insira o código fornecido pelo seu veterinário para conectar seus pets automaticamente.
                    </Text>

                    <View className="bg-white rounded-xl border border-emerald-200 flex-row items-center px-4 py-1">
                        <Ionicons name="qr-code-outline" size={20} color="#10B981" />
                        <Input 
                            placeholder="CÓDIGO (EX: VET-SILVA)"
                            value={formData.vetToken}
                            onChangeText={t => setFormData({...formData, vetToken: t.toUpperCase()})}
                            className="flex-1 mb-0 border-0 bg-transparent text-center font-bold tracking-widest text-emerald-900"
                            autoCapitalize="characters"
                        />
                    </View>
                </Animated.View>

                <Button 
                    title="Finalizar Cadastro" 
                    onPress={handleRegister}
                    loading={loading}
                    className="mb-10 shadow-xl shadow-primary-500/40"
                />

            </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}