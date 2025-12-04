import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface PetCardProps {
  name: string;
  breed?: string;
  age?: string | null;
  photoUrl?: string | null;
  onPress: () => void;
}

export function PetCard({ name, breed, age, photoUrl, onPress }: PetCardProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onPress}
      className="mr-5 w-72 h-48" // Aumentei um pouco a altura
    >
      <LinearGradient
        // Gradiente levemente inclinado para dar modernidade
        colors={['#10B981', '#047857']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 rounded-[32px] p-6 justify-between shadow-2xl shadow-emerald-500/30 overflow-hidden relative"
      >
        {/* Elementos Decorativos de Fundo (Círculos) */}
        <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <View className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl" />

        <View className="flex-row justify-between items-start z-10">
            <View>
                {/* Badge da Raça com mais contraste */}
                <View className="bg-white/20 px-3 py-1.5 rounded-full self-start mb-3 border border-white/10">
                    <Text className="text-white text-xs font-bold tracking-wide uppercase">
                        {breed || 'Raça não def.'}
                    </Text>
                </View>
                
                <Text className="text-white text-3xl font-extrabold tracking-tight shadow-sm">
                    {name}
                </Text>
                <Text className="text-emerald-50 text-base font-medium mt-1 opacity-90">
                    {age || 'Idade desconhecida'}
                </Text>
            </View>

            {/* Foto com borda mais grossa e sombra */}
            <View className="w-20 h-20 rounded-full border-[3px] border-white/40 bg-white/10 items-center justify-center overflow-hidden shadow-lg">
                 {photoUrl ? (
                    <Image source={{ uri: photoUrl }} className="w-full h-full" />
                 ) : (
                    <Ionicons name="paw" size={36} color="white" />
                 )}
            </View>
        </View>

        {/* Rodapé do Card */}
        <View className="flex-row items-center justify-between mt-2 z-10">
            <View className="flex-row items-center space-x-2 bg-black/10 px-3 py-1.5 rounded-lg">
                <Ionicons name="calendar" size={14} color="#A7F3D0" />
                <Text className="text-emerald-50 text-xs font-semibold">Vacina: --/--</Text>
            </View>
            <View className="bg-white/20 p-1 rounded-full">
                <Ionicons name="arrow-forward" size={20} color="white" />
            </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}