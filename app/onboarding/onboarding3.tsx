import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const BAR_DATA = [
    { label: 'M', h: 48, opacity: 0.25 },
    { label: 'T', h: 96, opacity: 0.25 },
    { label: 'W', h: 160, opacity: 1 },
    { label: 'T', h: 120, opacity: 0.25 },
    { label: 'F', h: 140, opacity: 0.25 },
    { label: 'S', h: 64, opacity: 0.25 },
    { label: 'S', h: 40, opacity: 0.25 },
];

import { useAuthStore } from '@/store/authStore';

export default function Onboarding3() {
    const router = useRouter();
    const { session, completeOnboarding } = useAuthStore();

    const handleGetStarted = async () => {
        if (session) {
            await completeOnboarding();
            router.replace('/(tabs)/home');
        } else {
            router.replace('/auth/register');
        }
    };

    return (
        <SafeAreaView style={styles.root}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <Text style={styles.logo}>Taply</Text>
            </View>

            {/* ── Illustration ── */}
            <View style={styles.illustrationWrapper}>
                <View style={styles.illustrationBg}>
                    {/* Chart card */}
                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Weekly Scans</Text>
                        <View style={styles.chartArea}>
                            {BAR_DATA.map((bar, i) => (
                                <View key={i} style={styles.barCol}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: bar.h * 0.55,
                                                backgroundColor: `rgba(53, 37, 205, ${bar.opacity})`,
                                            },
                                        ]}
                                    />
                                    <Text style={[styles.barLabel, bar.opacity === 1 && styles.barLabelActive]}>
                                        {bar.label}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Stats pill */}
                    <View style={styles.statPill}>
                        <Ionicons name="trending-up" size={14} color="#3525cd" />
                        <Text style={styles.statText}>+12.5% this week</Text>
                    </View>

                    {/* Scan count badge */}
                    <View style={styles.scanBadge}>
                        <Text style={styles.scanCount}>1,248</Text>
                        <Text style={styles.scanLabel}>Total Scans</Text>
                    </View>
                </View>
            </View>

            {/* ── Text ── */}
            <View style={styles.textBlock}>
                <Text style={styles.title}>Know Who's{'\n'}Interested</Text>
                <Text style={styles.desc}>
                    Track every scan, link click, and interaction. Gain real insights into who's engaging with your digital card.
                </Text>
            </View>

            {/* ── Dots ── */}
            <View style={styles.dots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={[styles.dot, styles.dotActive]} />
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
                    style={styles.getStartedBtn}
                    onPress={handleGetStarted}
                    activeOpacity={0.85}
                >
                    <Text style={styles.getStartedText}>Get Started</Text>
                    <Ionicons name="sparkles" size={18} color="#fff" />
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
    logo: { fontFamily: 'Manrope', fontSize: 20, color: '#4f46e5', letterSpacing: -1 },
    illustrationWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    illustrationBg: {
        width: width - 64,
        height: width - 64,
        backgroundColor: '#f0edec',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    chartCard: {
        width: 220,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
    },
    chartTitle: {
        fontFamily: 'Manrope',
        fontSize: 14,
        color: '#1c1b1b',
        marginBottom: 16,
    },
    chartArea: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 6,
        height: 100,
    },
    barCol: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
    },
    bar: {
        width: '100%',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        minHeight: 8,
    },
    barLabel: {
        fontFamily: 'Inter',
        fontSize: 9,
        color: '#777587',
    },
    barLabelActive: {
        fontFamily: 'InterSemiBold',
        color: '#3525cd',
    },
    statPill: {
        position: 'absolute',
        top: 24,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    statText: { fontFamily: 'InterMedium', fontSize: 12, color: '#3525cd' },
    scanBadge: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 4,
    },
    scanCount: { fontFamily: 'Manrope', fontSize: 22, color: '#1c1b1b', letterSpacing: -1 },
    scanLabel: { fontFamily: 'Inter', fontSize: 10, color: '#777587' },
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
    getStartedBtn: {
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
    getStartedText: { fontFamily: 'InterSemiBold', fontSize: 16, color: '#fff' },
});
