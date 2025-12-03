import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';

export default function NewPetScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', type: 'CACHORRO', breed: '', weight: '' });

  // 1. Abrir Galeria ou Câmera
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Mantém a qualidade baixa para upload rápido
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 2. Enviar dados
  const handleSubmit = async () => {
    if (!form.name || !form.weight) return Alert.alert('Atenção', 'Preencha nome e peso.');
    
    setLoading(true);
    try {
      let photoUrl = null;

      // A) Upload da Imagem (Modo FormData - Seguro para Mobile)
      if (image) {
        // Prepara o nome do arquivo
        const filename = image.split('/').pop() || 'pet_photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        // Cria o FormData
        const formData = new FormData();
        formData.append('file', {
          uri: image,   // Caminho local do arquivo
          name: filename,
          type: type,
        } as any); // O 'as any' é necessário para calar o TypeScript no React Native

        // Faz o upload direto (usando fetch nativo para não conflitar config do axios)
        // Nota: Use a URL base da sua API aqui
        const uploadResponse = await fetch('https://hospitalvetbackend-7jyy.vercel.app/api/upload?filename=' + filename, {
          method: 'POST',
          body: formData,
          headers: {
            // NUNCA defina Content-Type aqui para multipart/form-data
            // O fetch adiciona o boundary automaticamente
            'Accept': 'application/json',
          },
        });

        if (!uploadResponse.ok) throw new Error('Falha no upload da imagem');
        
        const uploadResult = await uploadResponse.json();
        photoUrl = uploadResult.url;
      }

      // B) Salvar Pet no Banco (Via Axios normal)
      await api.post('/pets', {
        ...form,
        photoUrl
      });

      Alert.alert('Sucesso', 'Pet cadastrado!', [{ text: 'OK', onPress: () => router.back() }]);

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao salvar. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-6 pt-4">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#10B981" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-primary-700 ml-4">Novo Pet</Text>
        </View>

        {/* Foto Avatar */}
        <View className="items-center mb-8">
          <TouchableOpacity onPress={pickImage} className="w-32 h-32 bg-secondary-100 rounded-full items-center justify-center border-2 border-dashed border-primary-500 overflow-hidden relative">
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full" />
            ) : (
              <Ionicons name="camera" size={40} color="#10B981" />
            )}
            
            {/* Ícone de editar sobreposto */}
            <View className="absolute bottom-0 bg-black/30 w-full items-center py-1">
              <Text className="text-white text-xs font-bold">EDITAR</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="ml-1 mb-1 font-medium text-text-main">Nome do Pet</Text>
            <TextInput 
              className="bg-white p-4 rounded-xl border border-gray-200"
              value={form.name}
              onChangeText={t => setForm({...form, name: t})}
              placeholder="Ex: Rex"
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="ml-1 mb-1 font-medium text-text-main">Raça</Text>
              <TextInput 
                className="bg-white p-4 rounded-xl border border-gray-200"
                value={form.breed}
                onChangeText={t => setForm({...form, breed: t})}
                placeholder="Ex: Poodle"
              />
            </View>
            <View className="flex-1">
              <Text className="ml-1 mb-1 font-medium text-text-main">Peso (kg)</Text>
              <TextInput 
                className="bg-white p-4 rounded-xl border border-gray-200"
                value={form.weight}
                onChangeText={t => setForm({...form, weight: t})}
                placeholder="Ex: 5.2"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={loading}
          className="bg-primary-500 mt-10 py-4 rounded-xl items-center shadow-lg shadow-primary-500/30 mb-10"
        >
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Salvar Pet</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}