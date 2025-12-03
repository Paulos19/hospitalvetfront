import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Pet {
  id: string;
  name: string;
  breed: string | null;
  weight: number | null;
  photoUrl: string | null;
}

export function PetCard({ pet, index }: { pet: Pet; index: number }) {
  const router = useRouter();

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()} 
      className="mb-4"
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push({ pathname: '/(client)/pet/[id]', params: { id: pet.id } })}
        className="bg-white p-4 rounded-3xl flex-row items-center shadow-sm border border-gray-100"
      >
        {/* Imagem com Borda Colorida */}
        <View className="relative">
            <View className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                <Image 
                    source={{ uri: pet.photoUrl || 'https://via.placeholder.com/150' }} 
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>
            {/* Badge de "Tipo" (ícone estático por enquanto) */}
            <View className="absolute -bottom-2 -right-2 bg-primary-100 p-1.5 rounded-full border-2 border-white">
                <Ionicons name="paw" size={12} color="#10B981" />
            </View>
        </View>

        <View className="ml-5 flex-1 justify-center py-1">
            <View className="flex-row justify-between items-center mb-1">
                <Text className="text-xl font-bold text-gray-800">{pet.name}</Text>
                <Ionicons name="chevron-forward" size={20} color="#E5E7EB" />
            </View>
            
            <Text className="text-gray-500 text-sm mb-3">
                {pet.breed || 'Sem raça definida'}
            </Text>

            {/* Info Chips */}
            <View className="flex-row gap-2">
                <View className="bg-gray-50 px-3 py-1 rounded-lg">
                    <Text className="text-xs font-medium text-gray-600">
                        ⚖️ {pet.weight ? `${pet.weight}kg` : '--'}
                    </Text>
                </View>
                {/* Aqui poderíamos ter lógica de "Vacinas OK" futura */}
                <View className="bg-emerald-50 px-3 py-1 rounded-lg">
                    <Text className="text-xs font-bold text-emerald-600">
                        Ativo
                    </Text>
                </View>
            </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}