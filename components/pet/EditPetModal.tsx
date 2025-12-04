import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { api } from '../../src/services/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface EditPetModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  pet: any;
}

export function EditPetModal({ visible, onClose, onSave, pet }: EditPetModalProps) {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [type, setType] = useState<'CACHORRO' | 'GATO' | 'OUTRO'>('CACHORRO');
  const [sex, setSex] = useState<'MACHO' | 'FEMEA'>('MACHO');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pet) {
      setName(pet.name || '');
      setWeight(pet.weight ? pet.weight.toString() : '');
      setBreed(pet.breed || '');
      setType(pet.type || 'CACHORRO');
      setSex(pet.sex || 'MACHO');
      setBirthDate(pet.birthDate ? new Date(pet.birthDate).toLocaleDateString('pt-BR') : '');
    }
  }, [pet, visible]);

  function handleDateChange(text: string) {
    let clean = text.replace(/[^0-9]/g, '');
    if (clean.length > 8) clean = clean.substring(0, 8);
    if (clean.length >= 5) clean = clean.substring(0, 2) + '/' + clean.substring(2, 4) + '/' + clean.substring(4);
    else if (clean.length >= 3) clean = clean.substring(0, 2) + '/' + clean.substring(2);
    setBirthDate(clean);
  }

  async function handleUpdate() {
    setLoading(true);
    try {
      // Conversão manual de DD/MM/AAAA para Date
      const parts = birthDate.split('/');
      const dateObj = parts.length === 3 ? new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])) : null;
      
      await api.put(`/pets/${pet.id}`, {
        name, breed, type, sex,
        weight: weight ? parseFloat(weight.replace(',', '.')) : null,
        birthDate: dateObj ? dateObj.toISOString() : undefined,
      });
      onSave(); onClose();
    } catch (error) {
      alert('Erro ao atualizar. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end bg-black/60">
        <View className="bg-white rounded-t-[32px] h-[85%] w-full shadow-2xl">
          <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-800">Editar Pet</Text>
            <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-full">
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 24 }}>
            {/* TIPO */}
            <View className="flex-row gap-4 mb-6">
                 <View className="flex-1">
                    <Text className="text-xs font-bold text-gray-500 mb-2 uppercase">Tipo</Text>
                    <View className="flex-row gap-2">
                        {['CACHORRO', 'GATO'].map(t => (
                            <TouchableOpacity key={t} onPress={() => setType(t as any)} className={`flex-1 py-3 items-center rounded-xl border ${type === t ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                                <Ionicons name={t === 'CACHORRO' ? 'paw' : 'logo-octocat'} size={20} color={type === t ? '#10B981' : '#9CA3AF'} />
                            </TouchableOpacity>
                        ))}
                    </View>
                 </View>
                 <View className="flex-1">
                    <Text className="text-xs font-bold text-gray-500 mb-2 uppercase">Sexo</Text>
                    <View className="flex-row gap-2">
                        <TouchableOpacity onPress={() => setSex('MACHO')} className={`flex-1 py-3 items-center rounded-xl border ${sex === 'MACHO' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                            <Ionicons name="male" size={20} color={sex === 'MACHO' ? '#3B82F6' : '#9CA3AF'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSex('FEMEA')} className={`flex-1 py-3 items-center rounded-xl border ${sex === 'FEMEA' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}>
                            <Ionicons name="female" size={20} color={sex === 'FEMEA' ? '#EC4899' : '#9CA3AF'} />
                        </TouchableOpacity>
                    </View>
                 </View>
            </View>
            <Input value={name} onChangeText={setName} icon="heart-outline" placeholder="Nome" />
            <View className="h-4"/>
            <View className="flex-row gap-4">
                <View className="flex-1"><Input value={weight} onChangeText={setWeight} icon="scale-outline" keyboardType="numeric" placeholder="Peso" /></View>
                <View className="flex-1"><Input value={birthDate} onChangeText={handleDateChange} icon="calendar-outline" keyboardType="numeric" maxLength={10} placeholder="Data" /></View>
            </View>
            <View className="h-4"/>
            <Input value={breed} onChangeText={setBreed} icon="ribbon-outline" placeholder="Raça" />
            <Button title="Salvar" onPress={handleUpdate} loading={loading} className="mt-8" />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}