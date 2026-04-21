import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Onboarding2() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.logo}>Taply</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/home')}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* ── Illustration ── */}
      <View style={styles.illustrationWrapper}>
        <View style={styles.illustrationBg}>
          {/* QR code placeholder */}
          <View style={styles.qrBox}>
            <View style={styles.qrGrid}>
              {Array.from({ length: 36 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.qrCell,
                    Math.random() > 0.45 && styles.qrCellFilled,
                  ]}
                />
              ))}
            </View>
            {/* Corner squares */}
            <View style={[styles.corner, { top: 12, left: 12 }]} />
            <View style={[styles.corner, { top: 12, right: 12 }]} />
            <View style={[styles.corner, { bottom: 12, left: 12 }]} />
          </View>

          {/* Check badge */}
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={20} color="#fff" />
          </View>

          {/* Share label */}
          <View style={styles.shareLabel}>
            <Ionicons name="share-outline" size={14} color="#3525cd" />
            <Text style={styles.shareLabelText}>Shared!</Text>
          </View>
        </View>
      </View>

      {/* ── Text ── */}
      <View style={styles.textBlock}>
        <Text style={styles.title}>Share With{'\n'}a Single Tap</Text>
        <Text style={styles.desc}>
          Share your profile instantly via QR code, NFC, or a link — no app needed on their end. It just works.
        </Text>
      </View>

      {/* ── Dots ── */}
      <View style={styles.dots}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </View>

      {/* ── CTA ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={18} color="#3525cd" />
        </TouchableOpacity>
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

const QR_CELL_SEED = Array.from({ length: 36 }).map(() => Math.random() > 0.45);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fcf9f8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logo: { fontFamily: 'Manrope', fontSize: 20, color: '#4f46e5', letterSpacing: -1 },
  skip: { fontFamily: 'InterMedium', fontSize: 14, color: '#777587' },
  illustrationWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustrationBg: {
    width: width - 64,
    height: width - 64,
    backgroundColor: '#e2dfff',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  qrBox: {
    width: 160,
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#3525cd',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
    position: 'relative',
  },
  qrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  qrCell: {
    width: 18,
    height: 18,
    backgroundColor: '#e5e2e1',
    borderRadius: 2,
  },
  qrCellFilled: {
    backgroundColor: '#3525cd',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderWidth: 4,
    borderColor: '#3525cd',
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  checkBadge: {
    position: 'absolute',
    top: 20,
    right: 28,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3525cd',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3525cd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  shareLabel: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  shareLabelText: { fontFamily: 'InterSemiBold', fontSize: 12, color: '#3525cd' },
  textBlock: { paddingHorizontal: 28, gap: 12, marginTop: 8 },
  title: {
    fontFamily: 'Manrope',
    fontSize: 32,
    letterSpacing: -0.8,
    color: '#1c1b1b',
    lineHeight: 40,
  },
  desc: { fontFamily: 'Inter', fontSize: 16, color: '#464555', lineHeight: 24 },
  dots: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 28,
    marginTop: 24,
    marginBottom: 12,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#e5e2e1' },
  dotActive: { width: 24, backgroundColor: '#3525cd' },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backBtn: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#e2dfff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtn: {
    flex: 1,
    backgroundColor: '#3525cd',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#3525cd',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  nextBtnText: { fontFamily: 'InterSemiBold', fontSize: 16, color: '#fff' },
});
