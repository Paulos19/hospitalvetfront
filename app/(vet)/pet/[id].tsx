import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../src/services/api';

// Interfaces para tipagem
interface Vaccine {
  id: string;
  name: string;
  dateAdministered: string;
  nextDueDate: string | null;
}

interface Prescription {
  id: string;
  title: string;
  description: string;
  medications: string;
  issuedAt: string;
}

interface PetDetails {
  id: string;
  name: string;
  breed: string;
  weight: number;
  photoUrl: string;
  ownerId: string; // Importante para o agendamento
  vaccinations: Vaccine[];
  prescriptions: Prescription[];
  owner: { 
    name: string;
    phone?: string | null;
  };
}

export default function PetDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [pet, setPet] = useState<PetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados de Modais
  const [vaccineModalVisible, setVaccineModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  
  // Form Vacina
  const [vacName, setVacName] = useState('');
  const [nextDate, setNextDate] = useState(''); 

  // Form Agendamento
  const [scheduleReason, setScheduleReason] = useState('');
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  async function fetchDetails() {
    try {
      const res = await api.get(`/vet/pet/${id}`);
      setPet(res.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o pet.');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    fetchDetails(); 
  }, [id]);

  // --- Lógica de Vacina ---
  async function handleAddVaccine() {
    if (!vacName) return Alert.alert('Erro', 'Nome da vacina é obrigatório');
    try {
      await api.post('/vet/vaccines', {
        name: vacName,
        dateAdministered: new Date().toISOString(),
        nextDueDate: nextDate ? new Date(nextDate).toISOString() : null,
        petId: id
      });
      setVaccineModalVisible(false);
      setVacName('');
      setNextDate('');
      fetchDetails(); 
      Alert.alert('Sucesso', 'Vacina registrada!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar vacina.');
    }
  }

  // --- Lógica de Agendamento ---
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || scheduleDate;
    setShowDatePicker(Platform.OS === 'ios'); // No iOS mantém aberto, no Android fecha ao selecionar
    setScheduleDate(currentDate);
  };

  async function handleAddAppointment() {
    if (!scheduleReason) return Alert.alert('Erro', 'Informe o motivo da consulta.');

    try {
      await api.post('/appointments', {
        date: scheduleDate.toISOString(),
        reason: scheduleReason,
        petId: pet?.id,
        clientId: pet?.ownerId 
      });
      
      setScheduleModalVisible(false);
      setScheduleReason('');
      Alert.alert('Sucesso', 'Agendamento criado!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao agendar.');
    }
  }


  if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator color="#10B981"/></View>;
  if (!pet) return <View className="flex-1 justify-center items-center"><Text>Pet não encontrado</Text></View>;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView>
        {/* Header do Pet */}
        <View className="bg-white pb-6 rounded-b-3xl shadow-sm">
          <View className="px-6 flex-row items-center mb-4 pt-2">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#047857" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-primary-700">Prontuário</Text>
          </View>
          
          <View className="items-center">
            <Image 
              source={{ uri: pet.photoUrl || 'https://via.placeholder.com/150' }} 
              className="w-32 h-32 rounded-full border-4 border-secondary-100 bg-gray-200"
            />
            <Text className="text-2xl font-bold text-primary-700 mt-3">{pet.name}</Text>
            <Text className="text-text-muted">{pet.breed || 'Sem raça'} • {pet.weight}kg</Text>
            <View className="bg-secondary-100 px-4 py-2 rounded-xl mt-3 items-center">
              <Text className="text-xs text-primary-700 font-bold uppercase tracking-wider">Tutor Responsável</Text>
              <Text className="text-sm text-primary-900 font-medium">{pet.owner?.name}</Text>
              {pet.owner?.phone && (
                <Text className="text-xs text-text-muted mt-1">📞 {pet.owner.phone}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Seção de Ações Rápidas */}
        <View className="px-6 mt-6 flex-row gap-4">
          <TouchableOpacity 
            onPress={() => setVaccineModalVisible(true)}
            className="flex-1 bg-white p-4 rounded-xl items-center border border-gray-200 shadow-sm"
          >
            <Ionicons name="shield-checkmark" size={24} color="#047857" />
            <Text className="text-primary-700 font-bold mt-2 text-center">Vacinar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setScheduleModalVisible(true)}
            className="flex-1 bg-primary-500 p-4 rounded-xl items-center shadow-md shadow-primary-500/30"
          >
            <Ionicons name="calendar" size={24} color="white" />
            <Text className="text-white font-bold mt-2 text-center">Agendar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.push({
              pathname: '/(vet)/prescription/create',
              params: { petId: pet.id, petName: pet.name }
            })}
            className="flex-1 bg-white p-4 rounded-xl items-center border border-gray-200 shadow-sm"
          >
            <Ionicons name="document-text" size={24} color="#047857" />
            <Text className="text-primary-700 font-bold mt-2 text-center">Receita</Text>
          </TouchableOpacity>
        </View>

        {/* Histórico de Vacinas */}
        <View className="px-6 mt-8">
          <Text className="text-lg font-bold text-primary-700 mb-4">Carteira de Vacinação</Text>
          {pet.vaccinations.length === 0 ? (
            <Text className="text-text-muted italic">Nenhuma vacina registrada.</Text>
          ) : (
            pet.vaccinations.map((vac) => (
              <View key={vac.id} className="bg-white p-4 rounded-xl mb-3 flex-row items-center border-l-4 border-primary-500 shadow-sm">
                <View className="flex-1">
                  <Text className="text-base font-bold text-text-main">{vac.name}</Text>
                  <Text className="text-xs text-text-muted">
                    Aplicada em: {new Date(vac.dateAdministered).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                {vac.nextDueDate && (
                  <View className="bg-orange-100 px-2 py-1 rounded">
                    <Text className="text-xs text-orange-700 font-bold">
                      Revacinar: {new Date(vac.nextDueDate).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>

        {/* Histórico de Receitas */}
        <View className="px-6 mt-6 mb-10">
          <Text className="text-lg font-bold text-primary-700 mb-4">Histórico Clínico</Text>
          {pet.prescriptions.length === 0 ? (
            <Text className="text-text-muted italic">Nenhuma receita emitida.</Text>
          ) : (
            pet.prescriptions.map((presc) => (
              <View key={presc.id} className="bg-white p-4 rounded-xl mb-3 border border-gray-100 shadow-sm">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-base font-bold text-primary-700">{presc.title}</Text>
                  <Text className="text-xs text-text-muted">
                    {new Date(presc.issuedAt).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <Text className="text-text-main mb-2 text-sm">{presc.description}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* --- MODAL VACINA --- */}
      <Modal visible={vaccineModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 h-auto pb-10">
            <Text className="text-xl font-bold text-primary-700 mb-6">Registrar Vacina</Text>
            <TextInput 
              className="bg-gray-100 p-4 rounded-xl mb-4 text-lg border border-gray-200"
              placeholder="Nome (ex: V10)"
              value={vacName}
              onChangeText={setVacName}
            />
            <TextInput 
              className="bg-gray-100 p-4 rounded-xl mb-6 text-lg border border-gray-200"
              placeholder="Próxima Dose (AAAA-MM-DD)"
              value={nextDate}
              onChangeText={setNextDate}
              keyboardType="numbers-and-punctuation"
            />
            <TouchableOpacity onPress={handleAddVaccine} className="bg-primary-500 py-4 rounded-xl items-center mb-3">
              <Text className="text-white font-bold text-lg">Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVaccineModalVisible(false)} className="py-2">
              <Text className="text-center text-text-muted">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- MODAL AGENDAMENTO --- */}
      <Modal visible={scheduleModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6 h-auto pb-10">
            <Text className="text-xl font-bold text-primary-700 mb-6">Novo Agendamento</Text>
            
            <Text className="mb-2 font-bold text-gray-700">Motivo</Text>
            <TextInput 
                className="bg-gray-100 p-4 rounded-xl mb-4 text-lg border border-gray-200"
                placeholder="Ex: Retorno, Exame..."
                value={scheduleReason}
                onChangeText={setScheduleReason}
            />

            <Text className="mb-2 font-bold text-gray-700">Data e Hora</Text>
            <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                className="bg-gray-100 p-4 rounded-xl mb-6 border border-gray-200"
            >
                <Text className="text-lg text-center font-bold text-primary-700">
                  {scheduleDate.toLocaleDateString('pt-BR')} às {scheduleDate.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
                <DateTimePicker
                    value={scheduleDate}
                    mode="datetime"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    minimumDate={new Date()}
                />
            )}
            
            {/* Botão de fechar picker manual no iOS se necessário */}
            {Platform.OS === 'ios' && showDatePicker && (
              <TouchableOpacity onPress={() => setShowDatePicker(false)} className="items-end mb-4">
                 <Text className="text-primary-500 font-bold">Pronto</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
                onPress={handleAddAppointment}
                className="bg-primary-500 py-4 rounded-xl items-center mb-3 shadow-lg"
            >
                <Text className="text-white font-bold text-lg">Confirmar Agendamento</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setScheduleModalVisible(false)} className="py-2">
                <Text className="text-center text-text-muted">Cancelar</Text>
            </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}