import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

function CuratingSpinner() {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.spinnerWrapper}>
      <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
        {/* Arc drawn as a thick border with one transparent side */}
        <View style={styles.spinnerArc} />
      </Animated.View>
      <Text style={styles.curatingLabel}>CURATING</Text>
    </View>
  );
}

// ─── Logo Placeholder ─────────────────────────────────────────────────────────
function LogoBox() {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.logoContainer, { opacity, transform: [{ scale }] }]}>
      {/* ── DROP YOUR LOGO IMAGE HERE ────────────────────────────
          Replace this View with:
            <Image source={require('../assets/images/logo.png')} style={styles.logoImage} />
          ──────────────────────────────────────────────────── */}
      <View style={styles.logoBoxPlaceholder}>
        <Text style={styles.logoPlaceholderText}>T</Text>
      </View>
    </Animated.View>
  );
}

// ─── Splash Screen ────────────────────────────────────────────────────────────
export default function AnimatedSplashScreen() {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(14)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(150),
      Animated.timing(bottomOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.gradientTop} />

      <View style={styles.center}>
        <LogoBox />

        <Animated.Text
          style={[
            styles.title,
            { opacity: titleOpacity, transform: [{ translateY: titleY }] },
          ]}
        >
          Taply
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          DIGITAL IDENTITY GALLERY
        </Animated.Text>
      </View>

      {/* Bottom spinner */}
      <Animated.View style={[styles.bottom, { opacity: bottomOpacity }]}>
        <CuratingSpinner />
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const LOGO_SIZE = width * 0.28;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fcf9f8',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320,
    backgroundColor: 'rgba(229, 226, 225, 0.22)',
    borderBottomLeftRadius: 300,
    borderBottomRightRadius: 300,
  },
  // center block
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  // logo
  logoContainer: {
    marginBottom: 6,
    // soft drop-shadow via shadow props
    shadowColor: '#3525cd',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 12,
  },
  logoBoxPlaceholder: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE * 0.28,
    backgroundColor: '#3525cd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE * 0.28,
  },
  logoPlaceholderText: {
    color: '#ffffff',
    fontSize: LOGO_SIZE * 0.46,
    fontFamily: 'Manrope',
  },
  // wordmark
  title: {
    fontSize: 42,
    fontFamily: 'Manrope',
    color: '#1c1b1b',
    letterSpacing: -0.5,
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'InterSemiBold',
    color: '#777587',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  // bottom
  bottom: {
    alignItems: 'center',
    gap: 10,
  },
  spinnerWrapper: {
    alignItems: 'center',
    gap: 12,
  },
  spinner: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerArc: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2.5,
    borderColor: 'transparent',
    borderTopColor: '#3525cd',
    borderRightColor: '#3525cd',
  },
  curatingLabel: {
    fontSize: 11,
    fontFamily: 'InterSemiBold',
    color: '#777587',
    letterSpacing: 2.8,
  },
});
