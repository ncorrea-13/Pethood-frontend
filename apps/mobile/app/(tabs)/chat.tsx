import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** GUI-08 Chat Adoptante — placeholder visual hasta la historia del módulo. */
export default function ChatScreen() {
  return (
    <View className="flex-1 bg-pethood-beige">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="border-b border-gray-200 bg-white px-5 py-4">
          <Text className="text-xl font-bold text-gray-900">Chat</Text>
        </View>

        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-white">
            <Ionicons name="chatbubble-outline" size={36} color="#FF9D5C" />
          </View>
          <Text className="text-center text-lg font-bold text-gray-900">El chat se va a ir sumando acá</Text>
          <Text className="mt-2 text-center text-base leading-6 text-gray-500">
            Cuando esté listo vas a poder hablar con refugios y adoptantes desde esta pestaña.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
