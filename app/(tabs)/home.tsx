import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeMyCard() {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ── Top App Bar ── */}
      <View style={styles.header}>
        <Text style={styles.logo}>Taply</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header Text ── */}
        <View style={styles.headerText}>
          <Text style={styles.name}>Nibedan Pati</Text>
          <Text style={styles.role}>Software Engineer</Text>
        </View>

        {/* ── Card Area ── */}
        <View style={styles.cardArea}>
          <Text style={styles.cardHint}>Scan this to view my profile</Text>

          {/* QR Code */}
          <View style={styles.qrWrapper}>
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code-outline" size={96} color="#3525cd" />
            </View>
          </View>

          {/* Theme Selector */}
          {/* <View style={styles.themeRow}>
            <TouchableOpacity style={[styles.themeBtn, styles.themeBtnLight]} />
            <TouchableOpacity style={[styles.themeBtn, { backgroundColor: '#313030' }]} />
            <TouchableOpacity style={[styles.themeBtn, { backgroundColor: '#f6ebdd' }]} />
          </View> */}
        </View>

        {/* ── Action Buttons ── */}
        <View style={styles.actionsGrid}>
          {/* Share */}
          <TouchableOpacity style={styles.shareBtn} activeOpacity={0.85}>
            <Ionicons name="share-outline" size={20} color="#fff" />
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>

          {/* Save */}
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
            <Ionicons name="download-outline" size={18} color="#1c1b1b" />
            <Text style={styles.secondaryBtnText}>Save</Text>
          </TouchableOpacity>

          {/* Copy Link */}
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
            <Ionicons name="link-outline" size={18} color="#1c1b1b" />
            <Text style={styles.secondaryBtnText}>Copy Link</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fcf9f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logo: { fontFamily: 'Manrope', fontSize: 20, color: '#4f46e5', letterSpacing: -1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 24,
    alignItems: 'center',
  },
  // header text
  headerText: { alignItems: 'center', gap: 6 },
  name: {
    fontFamily: 'Manrope',
    fontSize: 30,
    color: '#1c1b1b',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  role: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: '#464555',
    textAlign: 'center',
  },
  // card area
  cardArea: {
    width: '100%',
    backgroundColor: '#f6f3f2',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 24,
    borderWidth: 1,
    borderColor: 'rgba(199,196,216,0.15)',
    shadowColor: '#1c1b1b',
    shadowOffset: { width: 0, height: 32 },
    shadowOpacity: 0.06,
    shadowRadius: 64,
    elevation: 4,
  },
  cardHint: { fontFamily: 'InterMedium', fontSize: 14, color: '#464555' },
  qrWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  qrPlaceholder: {
    width: 192,
    height: 192,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeRow: { flexDirection: 'row', gap: 8 },
  themeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(199,196,216,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  themeBtnLight: { backgroundColor: '#fff' },
  // actions
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  shareBtn: {
    flex: 1,
    backgroundColor: '#3525cd',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#3525cd',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  shareBtnText: { fontFamily: 'InterMedium', fontSize: 14, color: '#fff' },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#e5e2e1',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  secondaryBtnText: { fontFamily: 'InterMedium', fontSize: 14, color: '#1c1b1b' },
});
