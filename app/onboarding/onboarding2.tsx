import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Onboarding2() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#777587" />
        </TouchableOpacity>
        <Text style={styles.logo}>Taply</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.illustrationWrapper}>
        <Image
          source={require('@/assets/images/phone_frame.png')}
          style={styles.image}
          contentFit="contain"
        />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title}>Share in seconds</Text>
        <Text style={styles.desc}>
          A simple scan is all it takes to{'\n'}exchange info.
        </Text>
      </View>

      <View style={styles.dots}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => router.push('/onboarding/onboarding3')}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>Next</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fcf9f8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  logo: {
    fontFamily: 'Manrope',
    fontSize: 20,
    color: '#3525cd',
    letterSpacing: -0.5,
    fontWeight: 'bold',
  },
  illustrationWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: width * 0.85,
    height: width * 0.85,
  },
  textBlock: {
    paddingHorizontal: 28,
    gap: 12,
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Manrope',
    fontSize: 32,
    letterSpacing: -0.8,
    color: '#1c1b1b',
    lineHeight: 40,
    textAlign: 'center',
  },
  desc: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#464555',
    lineHeight: 24,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 28,
    marginTop: 32,
    marginBottom: 48,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#e5e2e1' },
  dotActive: { width: 24, backgroundColor: '#3525cd' },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  nextBtn: {
    backgroundColor: '#3525cd',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 8,
  },
  nextBtnText: { fontFamily: 'InterSemiBold', fontSize: 16, color: '#fff' },
});
