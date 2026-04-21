import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ComingSoon() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#fcf9f8] relative">
      {/* Back Button */}
      <TouchableOpacity 
        className="absolute top-14 left-4 p-3 rounded-full z-10"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#1c1b1b" />
      </TouchableOpacity>

      <View className="flex-1 justify-center items-center px-8 w-full mt-[-60px]">
        {/* Icon Area */}
        <View className="w-[160px] h-[160px] rounded-full bg-[#f9f5f4] items-center justify-center mb-6">
          <View className="w-[112px] h-[112px] rounded-full bg-[#F4F1FE] items-center justify-center">
            <Ionicons name="construct" size={56} color="#3525cd" />
          </View>
        </View>

        {/* Text Details */}
        <Text className="font-manrope text-[32px] text-[#1c1b1b] mb-4 text-center tracking-[-0.8px]">
          Coming Soon
        </Text>
        
        <Text className="font-inter text-[16px] text-[#464555] text-center leading-[24px] max-w-[280px]">
          We're building something great. Stay tuned!
        </Text>

        {/* Pill Decoration */}
        <View className="w-12 h-1 rounded-full bg-[#e5e2e1] mt-12" />
      </View>
    </SafeAreaView>
  );
}
