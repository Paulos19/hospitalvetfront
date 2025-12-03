import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  ownerId: string;
  vaccinations: Vaccine[];
  prescriptions: Prescription[];
  owner: { 
    name: string;
    phone?: string | null;
  };
}

export default function PetDetailsScreen() {
  const { id } = useLocalSearchParams(); // Pega o ID da URL
  const router = useRouter();
  
  const [pet, setPet] = useState<PetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados de Modais
  const [vaccineModalVisible, setVaccineModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  
  // Form Vacina
  const [vacName, setVacName] = useState('');
  const [nextDate, setNextDate] = useState(''); 

  // Form Agendamento (MANUAL)
  const [scheduleReason, setScheduleReason] = useState('');
  const [scheduleDateText, setScheduleDateText] = useState(''); // Ex: 2025-10-10
  const [scheduleTimeText, setScheduleTimeText] = useState(''); // Ex: 14:30

  async function fetchDetails() {
    try {
      const res = await api.get(`/vet/pet/${id}`);
      setPet(res.data);
    } catch (error) {
      console.error("Erro fetchDetails:", error);
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
    
    let nextDueDateISO = null;
    
    if (nextDate) {
      const dateObj = new Date(nextDate);
      if (isNaN(dateObj.getTime())) {
        return Alert.alert('Data Inválida', 'Por favor, use o formato AAAA-MM-DD (ex: 2025-12-25).');
      }
      nextDueDateISO = dateObj.toISOString();
    }

    try {
      await api.post('/vet/vaccines', {
        name: vacName,
        dateAdministered: new Date().toISOString(),
        nextDueDate: nextDueDateISO, 
        petId: id
      });
      
      setVaccineModalVisible(false);
      setVacName('');
      setNextDate('');
      fetchDetails(); 
      Alert.alert('Sucesso', 'Vacina registrada!');
    } catch (error: any) {
      Alert.alert('Erro', 'Falha ao salvar vacina.');
    }
  }

  // --- Lógica de Agendamento (MANUAL) ---
  async function handleAddAppointment() {
    if (!scheduleReason || !scheduleDateText || !scheduleTimeText) {
        return Alert.alert('Erro', 'Preencha todos os campos.');
    }
    
    if (!pet?.ownerId) {
       return Alert.alert('Erro', 'Dados do tutor incompletos (ownerId faltando).');
    }

    // Validação básica de formato
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}$/;

    if (!dateRegex.test(scheduleDateText) || !timeRegex.test(scheduleTimeText)) {
       return Alert.alert('Formato Inválido', 'Use AAAA-MM-DD para data e HH:MM para hora.');
    }

    // Construção da data considerando fuso horário de Brasília (GMT-3)
    // Criamos a string no formato ISO com offset explícito
    const dateTimeString = `${scheduleDateText}T${scheduleTimeText}:00-03:00`;
    
    const dateObj = new Date(dateTimeString);
    
    if (isNaN(dateObj.getTime())) {
        return Alert.alert('Data/Hora Inválida', 'Verifique os valores inseridos.');
    }

    try {
      await api.post('/appointments', {
        date: dateObj.toISOString(), // Envia como UTC, mas o momento temporal está correto
        reason: scheduleReason,
        petId: pet?.id,
        clientId: pet?.ownerId 
      });
      
      setScheduleModalVisible(false);
      setScheduleReason('');
      setScheduleDateText('');
      setScheduleTimeText('');
      Alert.alert('Sucesso', 'Agendamento criado!');
    } catch (error) {
      console.error("Erro agendamento:", error);
      Alert.alert('Erro', 'Falha ao agendar.');
    }
  }


  if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator color="#10B981"/></View>;
  if (!pet) return <View className="flex-1 justify-center items-center"><Text>Pet não encontrado</Text></View>;
  
  // Pega o ano atual para sugestão no placeholder
  const currentYear = new Date().getFullYear();

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
              placeholder={`Próxima Dose (${currentYear}-MM-DD)`}
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

      {/* --- MODAL AGENDAMENTO MANUAL --- */}
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

            <View className="flex-row gap-4 mb-6">
                <View className="flex-1">
                    <Text className="mb-2 font-bold text-gray-700">Data (AAAA-MM-DD)</Text>
                    <TextInput 
                        className="bg-gray-100 p-4 rounded-xl text-lg border border-gray-200"
                        placeholder={`${currentYear}-12-25`}
                        value={scheduleDateText}
                        onChangeText={setScheduleDateText}
                        keyboardType="numbers-and-punctuation"
                    />
                </View>
                <View className="flex-1">
                    <Text className="mb-2 font-bold text-gray-700">Hora (HH:MM)</Text>
                    <TextInput 
                        className="bg-gray-100 p-4 rounded-xl text-lg border border-gray-200"
                        placeholder="14:30"
                        value={scheduleTimeText}
                        onChangeText={setScheduleTimeText}
                        keyboardType="numbers-and-punctuation"
                    />
                </View>
            </View>

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