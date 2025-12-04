import { Modal, Text, View } from 'react-native';
import { Loading } from './Loading';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message = 'Carregando...' }: LoadingOverlayProps) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View className="flex-1 bg-black/40 items-center justify-center">
        <View className="bg-white p-6 rounded-3xl items-center shadow-xl w-48">
          <Loading size={100} />
          <Text className="text-gray-600 font-medium mt-4 text-center">
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}