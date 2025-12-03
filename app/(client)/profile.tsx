import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';
import { useAuthStore } from '../../src/store/authStore';

export default function ClientProfile() {
  const { user, signOut, updateUser } = useAuthStore();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  async function handleLogout() {
    await signOut();
    router.replace('/'); 
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Quadrado para perfil
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0].uri) {
        await handleUpload(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const handleUpload = async (uri: string) => {
    setUploading(true);
    try {
      const filename = uri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      const formData = new FormData();
      formData.append('file', { uri, name: filename, type } as any);

      // URL de produção estável
      const apiUrl = 'https://hospitalvetbackend.vercel.app/api/upload';
      console.log('Iniciando upload para:', apiUrl);

      // 1. Upload para o Blob
      const uploadRes = await fetch(`${apiUrl}?filename=${filename}`, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      // Ler resposta crua para debug
      const responseText = await uploadRes.text();
      console.log('Resposta do servidor (Upload):', responseText);

      if (!uploadRes.ok) {
        let errorMessage = 'Falha no upload';
        try {
            const errorJson = JSON.parse(responseText);
            if (errorJson.error) errorMessage = errorJson.error;
        } catch (e) {
            errorMessage = responseText.substring(0, 100);
        }
        throw new Error(errorMessage);
      }
      
      const { url } = JSON.parse(responseText);

      // 2. Atualizar o usuário no backend
      await api.patch('/users/me', { photoUrl: url });

      // 3. Atualizar estado local
      updateUser({ photoUrl: url });
      
      Alert.alert('Sucesso', 'Foto de perfil atualizada!');
    } catch (error: any) {
      console.error('Erro no handleUpload:', error);
      Alert.alert('Erro no Upload', error.message || 'Falha ao atualizar foto.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6 pt-10">
      <View className="items-center mb-10">
        <TouchableOpacity onPress={pickImage} className="relative">
            <View className="w-32 h-32 bg-secondary-100 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm overflow-hidden">
            {user?.photoUrl ? (
                <Image source={{ uri: user.photoUrl }} className="w-full h-full" />
            ) : (
                <Text className="text-5xl">👤</Text>
            )}
            </View>
            <View className="absolute bottom-4 right-0 bg-primary-500 p-2 rounded-full border-2 border-white">
                {uploading ? <ActivityIndicator size="small" color="white" /> : <Ionicons name="camera" size={16} color="white" />}
            </View>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-primary-700">{user?.name || 'Usuário'}</Text>
        <Text className="text-text-muted">Tutor de Pet</Text>
      </View>

      <View className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
        <View className="flex-row items-center py-3 border-b border-gray-100">
          <Ionicons name="mail-outline" size={20} color="#047857" />
          <View className="ml-4">
            <Text className="text-xs text-text-muted uppercase">E-mail</Text>
            <Text className="text-base text-text-main">{user?.email}</Text>
          </View>
        </View>
        
        <View className="flex-row items-center py-3">
           <Ionicons name="finger-print-outline" size={20} color="#047857" />
           <View className="ml-4">
             <Text className="text-xs text-text-muted uppercase">ID do Usuário</Text>
             <Text className="text-xs text-text-main font-mono">{user?.id}</Text>
           </View>
        </View>
      </View>

      <TouchableOpacity 
        onPress={handleLogout}
        className="flex-row items-center justify-center bg-red-50 p-4 rounded-xl border border-red-100"
      >
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text className="text-red-500 font-bold ml-2">Sair da Conta</Text>
      </TouchableOpacity>

      <View className="flex-1 justify-end pb-8 items-center">
        <Text className="text-xs text-text-muted">Hospital Veterinário Cães & Cia v1.0</Text>
      </View>
    </SafeAreaView>
  );
}