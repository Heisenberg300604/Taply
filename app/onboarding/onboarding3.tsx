import { useAuthStore } from '@/store/authStore';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

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
            <View style={styles.illustrationWrapper}>
                <Image
                    source={require('@/assets/images/total_scans.png')}
                    style={styles.image}
                    contentFit="contain"
                />
            </View>

            <View style={styles.textBlock}>
                <Text style={styles.title}>Watch who's{'\n'}interested.</Text>
                <Text style={styles.desc}>
                    Track every scan and see your{'\n'}network grow in real-time.
                </Text>
            </View>

            <View style={styles.dots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={[styles.dot, styles.dotActive]} />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.getStartedBtn}
                    onPress={handleGetStarted}
                    activeOpacity={0.85}
                >
                    <Text style={styles.getStartedText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#fcf9f8' },
    illustrationWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    image: {
        width: width * 0.85,
        height: width * 0.95,
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
    getStartedBtn: {
        backgroundColor: '#3525cd',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
    },
    getStartedText: { fontFamily: 'InterSemiBold', fontSize: 16, color: '#fff' },
});
