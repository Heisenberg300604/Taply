import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/utils/supabase';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState, useCallback } from 'react';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import { TextInput, RefreshControl } from 'react-native';

const AnimatedText = Animated.createAnimatedComponent(TextInput);

// Removed static BARS and SCANS arrays since we are now fully dynamic

// ─── Recent Scans ─────────────────────────────────────────────────────────────
const SCANS = [
  { city: 'New York, NY', device: 'Mobile • iOS', time: 'Just now', highlighted: false },
  { city: 'London, UK', device: 'Desktop • Mac', time: '2 hrs ago', highlighted: true },
  { city: 'San Francisco, CA', device: 'Mobile • Android', time: '5 hrs ago', highlighted: false },
  { city: 'Austin, TX', device: 'Mobile • iOS', time: 'Yesterday', highlighted: true },
];

export default function AnalyticsInsights() {
  const { session } = useAuthStore();
  const [totalScans, setTotalScans] = useState(0);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [mobilePct, setMobilePct] = useState(0);
  const [desktopPct, setDesktopPct] = useState(0);
  
  const [dynamicBars, setDynamicBars] = useState<any[]>([]);
  const [trend, setTrend] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  const animatedValue = useSharedValue(0);

  const fetchAnalytics = async () => {
    if (!session?.user) return;
    const { data, error } = await supabase.from('scans').select('scanned_at, device, city').eq('profile_id', session.user.id).order('scanned_at', { ascending: false });
    if (error) {
      console.error('Fetch Analytics Error:', error);
      return;
    }
    if (data) {
      setTotalScans(data.length);
      animatedValue.value = withTiming(data.length, { duration: 1500 });
      setRecentScans(data.slice(0, 5));
      
      const deviceData = data.reduce((acc: any, val) => {
        const d = (val.device || '').toLowerCase();
        if (d.includes('mobile')) acc.m++;
        else if (d.includes('desktop') || d.includes('mac') || d.includes('windows')) acc.d++;
        else acc.m++; // default unknown to mobile
        return acc;
      }, { m: 0, d: 0 });
      const total = deviceData.m + deviceData.d || 1; 
      setMobilePct(Math.round((deviceData.m / total) * 100));
      setDesktopPct(Math.round((deviceData.d / total) * 100));

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      let thisWeekCount = 0;
      let lastWeekCount = 0;
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentBars = days.map(d => ({ label: d, height: 4, count: 0, opacity: 0.2, color: '#3525cd', active: false }));

      data.forEach((scan) => {
         const scanDate = new Date(scan.scanned_at);
         if (scanDate >= oneWeekAgo) {
             thisWeekCount++;
             const dayName = days[scanDate.getDay()];
             const bar = currentBars.find(b => b.label === dayName);
             if(bar) bar.count++;
         } else if (scanDate >= twoWeeksAgo && scanDate < oneWeekAgo) {
             lastWeekCount++;
         }
      });
      
      let percentChange = 0;
      if (lastWeekCount === 0) {
          percentChange = thisWeekCount > 0 ? 100 : 0;
      } else {
          percentChange = Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
      }
      setTrend(percentChange);

      const maxCount = Math.max(...currentBars.map(b => b.count), 1);
      currentBars.forEach(b => {
         b.height = Math.max(4, (b.count / maxCount) * 192);
         if (b.count === maxCount && maxCount > 0) {
             b.opacity = 0.6;
             b.active = true;
         }
      });
      const orderedBars = [
         currentBars[1], currentBars[2], currentBars[3], currentBars[4], currentBars[5], currentBars[6], currentBars[0]
      ];
      setDynamicBars(orderedBars);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [session]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  }, [session]);

  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${Math.floor(animatedValue.value)}`,
    } as any;
  });

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ── Top App Bar ── */}
      <View style={styles.header}>
        <Text style={styles.logo}>Taply</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3525cd" />}
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
            <AnimatedText 
              style={styles.metricValue} 
              animatedProps={animatedProps} 
              editable={false} 
              defaultValue="0" 
            />
            <View style={[styles.metricBadge, trend < 0 && { backgroundColor: 'rgba(186, 26, 26, 0.1)' }]}>
              <Ionicons name={trend < 0 ? "trending-down" : "trending-up"} size={12} color={trend < 0 ? "#ba1a1a" : "#3525cd"} />
              <Text style={[styles.metricBadgeText, trend < 0 && { color: "#ba1a1a" }]}>
                {trend > 0 ? '+' : ''}{trend}%
              </Text>
            </View>
          </View>
        </View>

        {/* ── Weekly Chart ── */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Weekly Scans</Text>
          <View style={styles.chartArea}>
            {dynamicBars.map((bar, i) => (
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
            <Text style={styles.devicePct}>{mobilePct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${mobilePct}%`, backgroundColor: '#3525cd' }]} />
          </View>

          <View style={styles.spacer} />

          {/* Desktop */}
          <View style={styles.deviceRow}>
            <View style={styles.deviceLeft}>
              <Ionicons name="desktop-outline" size={18} color="#464555" />
              <Text style={styles.deviceName}>Desktop</Text>
            </View>
            <Text style={styles.devicePct}>{desktopPct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${desktopPct}%`, backgroundColor: '#b6b4ff' }]} />
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

          {recentScans.length > 0 ? recentScans.map((scan, i) => (
            <View key={i} style={[styles.scanItem, i === 0 && styles.scanItemHighlighted]}>
              <View style={styles.scanLeft}>
                <View style={styles.scanIconCircle}>
                  <Ionicons name="location-outline" size={16} color="#464555" />
                </View>
                <View>
                  <Text style={styles.scanCity}>{scan.city || 'Unknown Location'}</Text>
                  <Text style={styles.scanDevice}>{scan.device ? scan.device : 'Mobile'}</Text>
                </View>
              </View>
              <Text style={styles.scanTime}>Recent</Text>
            </View>
          )) : (
            <Text style={{ fontFamily: 'Inter', color: '#777587', textAlign: 'center', marginVertical: 12 }}>No scans yet. Share your card to see them!</Text>
          )}
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
