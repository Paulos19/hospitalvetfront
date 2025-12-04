import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ScreenBackground } from '../../components/ui/ScreenBackground';
import { api } from '../../src/services/api';

export default function NewPetScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [type, setType] = useState<'CACHORRO' | 'GATO' | 'OUTRO'>('CACHORRO');
  const [sex, setSex] = useState<'MACHO' | 'FEMEA'>('MACHO'); // <--- Novo Estado
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  function parseDate(dateStr: string) {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }

  function handleDateChange(text: string) {
    let clean = text.replace(/[^0-9]/g, '');
    if (clean.length > 8) clean = clean.substring(0, 8);
    if (clean.length >= 5) {
        clean = clean.substring(0, 2) + '/' + clean.substring(2, 4) + '/' + clean.substring(4);
    } else if (clean.length >= 3) {
        clean = clean.substring(0, 2) + '/' + clean.substring(2);
    }
    setBirthDate(clean);
  }

  async function handleCreate() {
    if (!name || !birthDate) return Alert.alert('Ops', 'Nome e Data de Nascimento são obrigatórios');
    
    const dateObj = parseDate(birthDate);
    if (!dateObj) return Alert.alert('Erro', 'Data inválida. Use DD/MM/AAAA');

    setLoading(true);
    try {
      await api.post('/pets', {
        name,
        type,
        sex, // <--- Envia
        breed,
        birthDate: dateObj.toISOString(),
        weight: weight ? parseFloat(weight.replace(',', '.')) : undefined,
      });

      Alert.alert('Sucesso', 'Pet cadastrado!');
      router.back();
    } catch (error: any) {
        Alert.alert('Erro', 'Não foi possível cadastrar o pet.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenBackground>
      <SafeAreaView className="flex-1">
        <View className="px-6 py-4 flex-row items-center border-b border-gray-100/50">
            <TouchableOpacity onPress={() => router.back()} className="bg-white p-2 rounded-full shadow-sm">
                 <Ionicons name="arrow-back" size={24} color="#059669" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800 ml-4">Novo Pet</Text>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView contentContainerStyle={{ padding: 24 }}>
            
            <Text className="text-gray-600 font-semibold mb-3 ml-1">Quem é o novo integrante?</Text>
            
            {/* TIPO */}
            <View className="flex-row justify-between mb-4 gap-3">
                {['CACHORRO', 'GATO', 'OUTRO'].map((t) => (
                    <TouchableOpacity 
                        key={t}
                        onPress={() => setType(t as any)}
                        className={`flex-1 items-center justify-center p-4 rounded-2xl border-2 ${type === t ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'}`}
                    >
                        <Ionicons 
                            name={t === 'CACHORRO' ? 'paw' : t === 'GATO' ? 'logo-octocat' : 'egg'} 
                            size={24} 
                            color={type === t ? '#10B981' : '#9CA3AF'} 
                        />
                        <Text className={`text-xs font-bold mt-2 ${type === t ? 'text-primary-700' : 'text-gray-400'}`}>
                            {t}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* SEXO */}
            <Text className="text-gray-600 font-semibold mb-2 ml-1">Sexo</Text>
            <View className="flex-row gap-3 mb-6">
                 <TouchableOpacity 
                    onPress={() => setSex('MACHO')}
                    className={`flex-1 flex-row items-center justify-center p-3 rounded-xl border-2 ${sex === 'MACHO' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                >
                    <Ionicons name="male" size={20} color={sex === 'MACHO' ? '#3B82F6' : '#9CA3AF'} />
                    <Text className={`ml-2 font-bold ${sex === 'MACHO' ? 'text-blue-600' : 'text-gray-500'}`}>Macho</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => setSex('FEMEA')}
                    className={`flex-1 flex-row items-center justify-center p-3 rounded-xl border-2 ${sex === 'FEMEA' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white'}`}
                >
                    <Ionicons name="female" size={20} color={sex === 'FEMEA' ? '#EC4899' : '#9CA3AF'} />
                    <Text className={`ml-2 font-bold ${sex === 'FEMEA' ? 'text-pink-600' : 'text-gray-500'}`}>Fêmea</Text>
                </TouchableOpacity>
            </View>

            <View className="space-y-5">
                <View>
                    <Text className="text-gray-600 font-semibold mb-2 ml-1">Dados Principais</Text>
                    <Input placeholder="Nome do Pet" icon="heart-outline" value={name} onChangeText={setName} />
                </View>

                <View className="flex-row gap-3">
                    <View className="flex-1">
                         <Input placeholder="Nascimento" icon="calendar-outline" keyboardType="numeric" maxLength={10} value={birthDate} onChangeText={handleDateChange} />
                    </View>
                    <View className="flex-1">
                        <Input placeholder="Peso (kg)" icon="scale-outline" keyboardType="numeric" value={weight} onChangeText={setWeight} />
                    </View>
                </View>

                <Input placeholder="Raça (ex: Poodle, SRD)" icon="ribbon-outline" value={breed} onChangeText={setBreed} />
            </View>

            <View className="mt-8">
                <Button title="Salvar Pet" onPress={handleCreate} loading={loading} />
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}