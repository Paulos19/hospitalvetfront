import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
// Se não tiver expo-linear-gradient instalado, use View com bg-primary-500. 
// Assumirei View normal para não quebrar sem instalar, mas simulo o gradiente com cores.

interface Appointment {
  id: string;
  date: string;
  reason: string;
  pet: { name: string };
  doctor: { name: string };
}

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const dateObj = new Date(appointment.date);
  const day = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
  const time = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const weekDay = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });

  return (
    <View className="mr-4 w-72 h-40 rounded-3xl overflow-hidden shadow-lg shadow-emerald-500/30 bg-primary-500 relative">
        {/* Decorativo: Círculos de fundo para textura */}
        <View className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
        <View className="absolute bottom-[-20] left-[-20] w-24 h-24 bg-white/10 rounded-full" />

        <View className="p-5 flex-1 justify-between">
            {/* Cabeçalho do Card */}
            <View className="flex-row justify-between items-start">
                <View>
                    <View className="flex-row items-center space-x-1">
                        <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.8)" />
                        <Text className="text-white/80 text-xs font-medium uppercase tracking-wide">
                            {weekDay}
                        </Text>
                    </View>
                    <Text className="text-white text-2xl font-bold mt-1">
                        {day}
                    </Text>
                </View>
                
                <View className="bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md">
                    <Text className="text-white font-bold text-sm">{time}</Text>
                </View>
            </View>

            {/* Rodapé do Card */}
            <View>
                <View className="flex-row items-center mb-1">
                    <Text className="text-white font-bold text-lg mr-2">
                        {appointment.pet.name}
                    </Text>
                    <View className="bg-white/20 px-2 py-0.5 rounded text-[10px]">
                        <Text className="text-white text-[10px] font-bold">🐾 Paciente</Text>
                    </View>
                </View>
                
                <Text className="text-white/90 text-sm" numberOfLines={1}>
                    {appointment.reason} com Dr(a). {appointment.doctor.name}
                </Text>
            </View>
        </View>
    </View>
  );
}