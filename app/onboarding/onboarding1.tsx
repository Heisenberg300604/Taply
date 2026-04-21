import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Onboarding1() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.root}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <Text style={styles.logo}>Taply</Text>
                <TouchableOpacity onPress={() => router.replace('/auth/register')}>
                    <Text style={styles.skip}>Skip</Text>
                </TouchableOpacity>
            </View>

            {/* ── Illustration ── */}
            <View style={styles.illustrationWrapper}>
                <View style={styles.illustrationBg}>
                    {/* Floating card shape */}
                    <View style={styles.card}>
                        <View style={styles.cardRow}>
                            <View style={styles.avatarCircle} />
                            <View style={{ gap: 6, flex: 1 }}>
                                <View style={[styles.bar, { width: '70%' }]} />
                                <View style={[styles.bar, { width: '45%', opacity: 0.5 }]} />
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={{ gap: 8 }}>
                            <View style={styles.chip}><Text style={styles.chipText}>Portfolio</Text></View>
                            <View style={styles.chip}><Text style={styles.chipText}>LinkedIn</Text></View>
                        </View>
                        {/* NFC icon badge */}
                        <View style={styles.nfcBadge}>
                            <Ionicons name="wifi-outline" size={18} color="#3525cd" style={{ transform: [{ rotate: '90deg' }] }} />
                        </View>
                    </View>

                    {/* Phone silhouette scanning */}
                    <View style={styles.phoneScan}>
                        <View style={styles.phoneScanInner}>
                            <Ionicons name="phone-portrait-outline" size={36} color="#3525cd" />
                        </View>
                    </View>
                </View>
            </View>

            {/* ── Text ── */}
            <View style={styles.textBlock}>
                <Text style={styles.title}>Your Identity,{'\n'}Digitally Elevated</Text>
                <Text style={styles.desc}>
                    Create a stunning digital business card that lives in your pocket and opens with a single tap or scan.
                </Text>
            </View>

            {/* ── Dots ── */}
            <View style={styles.dots}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
            </View>

            {/* ── CTA ── */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.nextBtn}
                    onPress={() => router.push('/onboarding/onboarding2')}
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
    root: {
        flex: 1,
        backgroundColor: '#fcf9f8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    logo: {
        fontFamily: 'Manrope',
        fontSize: 20,
        color: '#4f46e5',
        letterSpacing: -1,
    },
    skip: {
        fontFamily: 'InterMedium',
        fontSize: 14,
        color: '#777587',
    },
    illustrationWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    illustrationBg: {
        width: width - 64,
        height: width - 64,
        backgroundColor: '#ebe7e7',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    card: {
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#3525cd',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.18,
        shadowRadius: 32,
        elevation: 12,
        position: 'relative',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e2dfff',
    },
    bar: {
        height: 8,
        backgroundColor: '#e5e2e1',
        borderRadius: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0edec',
        marginBottom: 12,
    },
    chip: {
        backgroundColor: '#f0edec',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
    },
    chipText: {
        fontFamily: 'InterMedium',
        fontSize: 11,
        color: '#464555',
    },
    nfcBadge: {
        position: 'absolute',
        top: -14,
        right: -14,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#e2dfff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    phoneScan: {
        position: 'absolute',
        bottom: 16,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    phoneScanInner: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBlock: {
        paddingHorizontal: 28,
        gap: 12,
        marginTop: 8,
    },
    title: {
        fontFamily: 'Manrope',
        fontSize: 32,
        letterSpacing: -0.8,
        color: '#1c1b1b',
        lineHeight: 40,
    },
    desc: {
        fontFamily: 'Inter',
        fontSize: 16,
        color: '#464555',
        lineHeight: 24,
    },
    dots: {
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: 28,
        marginTop: 24,
        marginBottom: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e5e2e1',
    },
    dotActive: {
        width: 24,
        backgroundColor: '#3525cd',
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    nextBtn: {
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
    nextBtnText: {
        fontFamily: 'InterSemiBold',
        fontSize: 16,
        color: '#fff',
    },
});