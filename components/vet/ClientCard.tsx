import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
// IMPORTANTE: Mude o import do Image para o nosso componente customizado
import { Image } from '@/components/ui/Image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface Pet {
  id: string;
  name: string;
  breed: string;
  photoUrl: string | null;
}

interface Client {
  id: string;
  name: string;
  email: string;
  pets: Pet[];
}

export function ClientCard({ client, index }: { client: Client; index: number }) {
  const router = useRouter();

  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).springify()}
      className="mb-4 bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center justify-between mb-4 border-b border-gray-50 pb-3">
        <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
                <Text className="text-primary-700 font-bold text-lg">
                    {client.name.charAt(0).toUpperCase()}
                </Text>
            </View>
            <View>
                <Text className="font-bold text-gray-800 text-lg">{client.name}</Text>
                <Text className="text-gray-400 text-xs">{client.pets.length} animais vinculados</Text>
            </View>
        </View>
        <TouchableOpacity className="p-2">
            <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {client.pets.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-1">
            {client.pets.map((pet) => (
                <TouchableOpacity 
                    key={pet.id}
                    onPress={() => router.push({
                        pathname: '/(vet)/pet/[id]',
                        params: { id: pet.id }
                    })}
                    className="mr-3 items-center bg-gray-50 p-3 rounded-2xl border border-gray-100 w-24 active:bg-gray-100"
                >
                    {/* Aqui o uso do nosso componente Image */}
                    <Image 
                        source={{ uri: pet.photoUrl || 'https://via.placeholder.com/80' }} 
                        className="w-12 h-12 rounded-full mb-2 bg-gray-200"
                    />
                    <Text numberOfLines={1} className="font-bold text-gray-700 text-xs mb-0.5">
                        {pet.name}
                    </Text>
                    <Text numberOfLines={1} className="text-gray-400 text-[10px]">
                        {pet.breed || 'SRD'}
                    </Text>
                </TouchableOpacity>
            ))}
            
            <View className="items-center justify-center w-12 ml-2">
                <TouchableOpacity className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center border border-gray-200 border-dashed">
                    <Ionicons name="add" size={16} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
        </ScrollView>
      ) : (
        <View className="bg-orange-50 p-3 rounded-xl flex-row items-center">
            <Ionicons name="alert-circle-outline" size={16} color="#F59E0B" />
            <Text className="text-orange-700 text-xs ml-2">Tutor sem pets cadastrados.</Text>
        </View>
      )}
    </Animated.View>
  );
}