import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// ─── Bar chart data (matches design) ─────────────────────────────────────────
const BARS = [
  { label: 'Mon', height: 48, opacity: 0.2, color: '#3525cd' },
  { label: 'Tue', height: 96, opacity: 0.2, color: '#3525cd' },
  { label: 'Wed', height: 192, opacity: 0.6, color: '#3525cd', active: true },
  { label: 'Thu', height: 128, opacity: 0.2, color: '#3525cd' },
  { label: 'Fri', height: 160, opacity: 0.2, color: '#3525cd' },
  { label: 'Sat', height: 64, opacity: 0.2, color: '#3525cd' },
  { label: 'Sun', height: 40, opacity: 0.2, color: '#3525cd' },
];

// ─── Recent Scans ─────────────────────────────────────────────────────────────
const SCANS = [
  { city: 'New York, NY', device: 'Mobile • iOS', time: 'Just now', highlighted: false },
  { city: 'London, UK', device: 'Desktop • Mac', time: '2 hrs ago', highlighted: true },
  { city: 'San Francisco, CA', device: 'Mobile • Android', time: '5 hrs ago', highlighted: false },
  { city: 'Austin, TX', device: 'Mobile • iOS', time: 'Yesterday', highlighted: true },
];

export default function AnalyticsInsights() {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ── Top App Bar ── */}
      <View style={styles.header}>
        <Text style={styles.logo}>Taply</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={16} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Page Title ── */}
        <View style={styles.pageTitle}>
          <Text style={styles.pageTitleText}>Insights Overview</Text>
          <Text style={styles.pageTitleSub}>
            Performance metrics for your digital business card.
          </Text>
        </View>

        {/* ── Metric Highlight ── */}
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>TOTAL SCANS</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricValue}>1,248</Text>
            <View style={styles.metricBadge}>
              <Ionicons name="trending-up" size={12} color="#3525cd" />
              <Text style={styles.metricBadgeText}>+12.5%</Text>
            </View>
          </View>
        </View>

        {/* ── Weekly Chart ── */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Weekly Scans</Text>
          <View style={styles.chartArea}>
            {BARS.map((bar, i) => (
              <View key={i} style={styles.barCol}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: bar.height,
                      backgroundColor: `rgba(53, 37, 205, ${bar.opacity})`,
                    },
                  ]}
                />
                <Text style={[styles.barLabel, bar.active && styles.barLabelActive]}>
                  {bar.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Device Breakdown ── */}
        <View style={styles.whiteCard}>
          <Text style={styles.cardTitle}>Devices</Text>

          {/* Mobile */}
          <View style={styles.deviceRow}>
            <View style={styles.deviceLeft}>
              <Ionicons name="phone-portrait-outline" size={18} color="#464555" />
              <Text style={styles.deviceName}>Mobile</Text>
            </View>
            <Text style={styles.devicePct}>82%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '82%', backgroundColor: '#3525cd' }]} />
          </View>

          <View style={styles.spacer} />

          {/* Desktop */}
          <View style={styles.deviceRow}>
            <View style={styles.deviceLeft}>
              <Ionicons name="desktop-outline" size={18} color="#464555" />
              <Text style={styles.deviceName}>Desktop</Text>
            </View>
            <Text style={styles.devicePct}>18%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '18%', backgroundColor: '#b6b4ff' }]} />
          </View>
        </View>

        {/* ── Recent Scans ── */}
        <View style={styles.whiteCard}>
          <View style={styles.recentHeader}>
            <Text style={styles.cardTitle}>Recent Scans</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {SCANS.map((scan, i) => (
            <View
              key={i}
              style={[styles.scanItem, scan.highlighted && styles.scanItemHighlighted]}
            >
              <View style={styles.scanLeft}>
                <View style={styles.scanIconCircle}>
                  <Ionicons name="location-outline" size={16} color="#464555" />
                </View>
                <View>
                  <Text style={styles.scanCity}>{scan.city}</Text>
                  <Text style={styles.scanDevice}>{scan.device}</Text>
                </View>
              </View>
              <Text style={styles.scanTime}>{scan.time}</Text>
            </View>
          ))}
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
  logo: { fontFamily: 'Manrope', fontSize: 20, color: '#4f46e5', letterSpacing: -0.5 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24, gap: 24 },

  // page title
  pageTitle: { gap: 8 },
  pageTitleText: {
    fontFamily: 'Manrope',
    fontSize: 30,
    color: '#1c1b1b',
    letterSpacing: -0.75,
  },
  pageTitleSub: { fontFamily: 'Inter', fontSize: 16, color: '#464555', lineHeight: 24 },

  // metric card
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  metricLabel: {
    fontFamily: 'InterMedium',
    fontSize: 12,
    color: '#464555',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  metricRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metricValue: {
    fontFamily: 'Manrope',
    fontSize: 52,
    color: '#1c1b1b',
    letterSpacing: -3,
  },
  metricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(79,70,229,0.1)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metricBadgeText: { fontFamily: 'InterMedium', fontSize: 13, color: '#3525cd' },

  // chart card
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    gap: 24,
  },
  cardTitle: {
    fontFamily: 'Manrope',
    fontSize: 18,
    color: '#1c1b1b',
    letterSpacing: -0.5,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
    gap: 6,
  },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  barFill: { width: '100%', borderTopLeftRadius: 2, borderTopRightRadius: 2, minHeight: 4 },
  barLabel: { fontFamily: 'Inter', fontSize: 11, color: '#464555' },
  barLabelActive: { fontFamily: 'InterSemiBold', color: '#3525cd' },

  // white card (devices + recent scans)
  whiteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  deviceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deviceLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deviceName: { fontFamily: 'InterMedium', fontSize: 14, color: '#1c1b1b' },
  devicePct: { fontFamily: 'InterSemiBold', fontSize: 14, color: '#1c1b1b' },
  progressTrack: {
    height: 8,
    backgroundColor: '#f0edec',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 8 },
  spacer: { height: 8 },

  // recent scans
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  viewAll: { fontFamily: 'InterMedium', fontSize: 14, color: '#3525cd' },
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  scanItemHighlighted: {
    backgroundColor: '#f6f3f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: -12,
  },
  scanLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scanIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ebe7e7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanCity: { fontFamily: 'InterMedium', fontSize: 14, color: '#1c1b1b' },
  scanDevice: { fontFamily: 'Inter', fontSize: 12, color: '#464555', marginTop: 1 },
  scanTime: { fontFamily: 'Inter', fontSize: 12, color: '#464555' },
});
