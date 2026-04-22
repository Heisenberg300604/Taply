import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Onboarding1() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.illustrationWrapper}>
                <Image
                    source={require('@/assets/images/onboarding_asset.png')}
                    style={styles.image}
                    contentFit="contain"
                />
            </View>

            <View style={styles.textBlock}>
                <Text style={styles.title}>Your card, always{'\n'}current.</Text>
                <Text style={styles.desc}>
                    Update once, share everywhere. Never{'\n'}print a business card again.
                </Text>
            </View>

            <View style={styles.dots}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.nextBtn}
                    onPress={() => router.push('/onboarding/onboarding2')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.nextBtnText}>Next</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.replace('/auth/register')} style={styles.skipBtn}>
                    <Text style={styles.skip}>Skip</Text>
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
    illustrationWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 15,
    },
    image: {
        width: width * 0.85,
        height: width * 1.1,
    },
    textBlock: {
        paddingHorizontal: 28,
        gap: 12,
        alignItems: 'center',
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
        marginBottom: 32,
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
    nextBtnText: {
        fontFamily: 'InterSemiBold',
        fontSize: 16,
        color: '#fff',
    },
    skipBtn: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    skip: {
        fontFamily: 'InterMedium',
        fontSize: 16,
        color: '#464555',
    },
});