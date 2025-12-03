import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Clipboard, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';
import { useAuthStore } from '../../src/store/authStore';

export default function VetProfile() {
  const { user, signOut, updateUser } = useAuthStore();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const inviteToken = (user as any)?.inviteToken || 'Carregando...'; 

  async function handleLogout() {
    await signOut();
    router.replace('/');
  }

  const copyToken = () => {
    Clipboard.setString(inviteToken);
    Alert.alert('Copiado!', 'Token copiado para a área de transferência.');
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
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
      const filename = uri.split('/').pop() || 'profile_vet.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      const formData = new FormData();
      formData.append('file', { uri, name: filename, type } as any);

      // CORREÇÃO: Usando a URL de produção estável
      // Nota: Em um projeto real, essa URL deveria vir de uma variável de ambiente (process.env.EXPO_PUBLIC_API_URL)
      const apiUrl = 'https://hospitalvetbackend.vercel.app/api/upload';
      console.log('Iniciando upload para:', apiUrl);

      const uploadRes = await fetch(`${apiUrl}?filename=${filename}`, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      // Tenta ler a resposta, seja sucesso ou erro
      const responseText = await uploadRes.text();
      console.log('Resposta do servidor (Upload):', responseText);

      if (!uploadRes.ok) {
        // Tenta extrair uma mensagem de erro do JSON, se possível
        let errorMessage = 'Falha no upload';
        try {
            const errorJson = JSON.parse(responseText);
            if (errorJson.error) errorMessage = errorJson.error;
        } catch (e) {
            // Se não for JSON, usa o texto puro (limitado)
            errorMessage = responseText.substring(0, 100);
        }
        throw new Error(errorMessage);
      }
      
      const { url } = JSON.parse(responseText);

      // Atualizar usuário
      await api.patch('/users/me', { photoUrl: url });

      // Atualizar estado local
      updateUser({ photoUrl: url });
      
      Alert.alert('Sucesso', 'Foto atualizada!');
    } catch (error: any) {
      console.error('Erro no handleUpload:', error);
      Alert.alert('Erro no Upload', error.message || 'Falha desconhecida ao atualizar foto.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6 pt-10">
      <View className="items-center mb-8">
        <TouchableOpacity onPress={pickImage} className="relative">
            <View className="w-24 h-24 bg-primary-50 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm overflow-hidden">
            {user?.photoUrl ? (
                <Image source={{ uri: user.photoUrl }} className="w-full h-full" />
            ) : (
                <Text className="text-4xl">👨‍⚕️</Text>
            )}
            </View>
            <View className="absolute bottom-4 right-[-5] bg-primary-700 p-1.5 rounded-full border-2 border-white">
                {uploading ? <ActivityIndicator size="small" color="white" /> : <Ionicons name="camera" size={12} color="white" />}
            </View>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-primary-700">{user?.name || 'Dr(a). Veterinário'}</Text>
        <Text className="text-text-muted">Médico Veterinário</Text>
      </View>

      {/* Cartão de Token - Exclusivo do Vet */}
      <View className="bg-primary-500 rounded-xl p-6 mb-6 shadow-md items-center">
        <Text className="text-white/80 text-xs uppercase font-bold mb-2">Seu Token de Vinculação</Text>
        <Text className="text-white text-2xl font-mono font-bold tracking-widest mb-4">{inviteToken}</Text>
        
        <TouchableOpacity 
            onPress={copyToken}
            className="bg-white/20 px-4 py-2 rounded-full flex-row items-center"
        >
            <Ionicons name="copy-outline" size={16} color="white" />
            <Text className="text-white font-bold ml-2 text-sm">Copiar Código</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
        <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
          <Ionicons name="settings-outline" size={20} color="#047857" />
          <Text className="ml-4 text-base text-text-main flex-1">Configurações</Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={handleLogout}
        className="flex-row items-center justify-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
      >
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text className="text-red-500 font-bold ml-2">Sair do App</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}