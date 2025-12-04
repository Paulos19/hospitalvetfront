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

      // A) Upload da Imagem
      if (image) {
        const filename = image.split('/').pop() || 'pet_photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        const formData = new FormData();
        formData.append('file', {
          uri: image,
          name: filename,
          type: type,
        } as any);

        // Ajuste a URL base se necessário
        const uploadResponse = await fetch('https://hospitalvetbackend.vercel.app/api/upload?filename=' + filename, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!uploadResponse.ok) throw new Error('Falha no upload da imagem');
        
        const uploadResult = await uploadResponse.json();
        photoUrl = uploadResult.url;
      }

      // B) Salvar Pet no Banco
      await api.post('/pets', {
        ...form,
        photoUrl
      });

      // SUCESSO: Navega para a tela de animação
      router.replace({
        pathname: '/success',
        params: {
          title: 'Oba! Novo Pet!',
          subtitle: `${form.name} foi cadastrado com sucesso.`,
          nextRoute: '/(client)/home',
          buttonText: 'Voltar para Home'
        }
      });

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao salvar. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView className="flex-1 px-6 pt-4">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#10B981" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800 ml-4">Novo Pet</Text>
        </View>

        {/* Foto Avatar */}
        <View className="items-center mb-8">
          <TouchableOpacity onPress={pickImage} className="w-32 h-32 bg-gray-100 rounded-full items-center justify-center border-2 border-dashed border-primary-500 overflow-hidden relative">
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full" />
            ) : (
              <Ionicons name="camera" size={40} color="#10B981" />
            )}
            
            <View className="absolute bottom-0 bg-black/30 w-full items-center py-1">
              <Text className="text-white text-xs font-bold">EDITAR</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="ml-1 mb-1 font-medium text-gray-600">Nome do Pet</Text>
            <TextInput 
              className="bg-white p-4 rounded-xl border border-gray-200 text-gray-800"
              value={form.name}
              onChangeText={t => setForm({...form, name: t})}
              placeholder="Ex: Rex"
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="ml-1 mb-1 font-medium text-gray-600">Raça</Text>
              <TextInput 
                className="bg-white p-4 rounded-xl border border-gray-200 text-gray-800"
                value={form.breed}
                onChangeText={t => setForm({...form, breed: t})}
                placeholder="Ex: Poodle"
              />
            </View>
            <View className="flex-1">
              <Text className="ml-1 mb-1 font-medium text-gray-600">Peso (kg)</Text>
              <TextInput 
                className="bg-white p-4 rounded-xl border border-gray-200 text-gray-800"
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