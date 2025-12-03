import { View } from 'react-native';
import { Skeleton } from '../ui/Skeleton';

export function HomeSkeleton() {
  return (
    <View className="p-6 pt-4">
      {/* Header Saudação */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Skeleton width={120} height={14} style={{ marginBottom: 8 }} />
          <Skeleton width={180} height={32} />
        </View>
        <Skeleton width={48} height={48} borderRadius={16} />
      </View>

      {/* Carrossel Agendamentos */}
      <View className="mb-8">
        <Skeleton width={150} height={20} style={{ marginBottom: 16 }} />
        <View className="flex-row overflow-hidden">
          <Skeleton width={288} height={160} borderRadius={24} style={{ marginRight: 16 }} />
          <Skeleton width={40} height={160} borderRadius={24} />
        </View>
      </View>

      {/* Lista de Pets */}
      <Skeleton width={100} height={20} style={{ marginBottom: 16 }} />
      
      {/* Pet Card 1 */}
      <View className="mb-4 p-4 border border-gray-100 rounded-3xl flex-row items-center bg-white">
        <Skeleton width={80} height={80} borderRadius={16} />
        <View className="ml-5 flex-1">
            <Skeleton width={120} height={24} style={{ marginBottom: 8 }} />
            <Skeleton width={80} height={16} style={{ marginBottom: 12 }} />
            <View className="flex-row gap-2">
                <Skeleton width={60} height={24} borderRadius={8} />
                <Skeleton width={60} height={24} borderRadius={8} />
            </View>
        </View>
      </View>

      {/* Pet Card 2 */}
      <View className="mb-4 p-4 border border-gray-100 rounded-3xl flex-row items-center bg-white">
        <Skeleton width={80} height={80} borderRadius={16} />
        <View className="ml-5 flex-1">
            <Skeleton width={100} height={24} style={{ marginBottom: 8 }} />
            <Skeleton width={60} height={16} style={{ marginBottom: 12 }} />
            <View className="flex-row gap-2">
                <Skeleton width={60} height={24} borderRadius={8} />
            </View>
        </View>
      </View>
    </View>
  );
}