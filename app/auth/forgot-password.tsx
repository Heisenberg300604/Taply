import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <SafeAreaView style={styles.root}>
      {/* ── Back header ── */}
      <TouchableOpacity
        style={styles.backRow}
        onPress={() => router.back()}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="arrow-back" size={18} color="#3525cd" />
        <Text style={styles.backText}>Taply</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {submitted ? (
            /* ── Success state ── */
            <View style={styles.successBlock}>
              <View style={styles.successIconCircle}>
                <Ionicons name="mail-outline" size={32} color="#3525cd" />
              </View>
              <Text style={styles.title}>Check your inbox</Text>
              <Text style={styles.subtitle}>
                We've sent a password reset link to{' '}
                <Text style={styles.emailHighlight}>{email}</Text>. It should arrive within a
                few minutes.
              </Text>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => router.push('/auth/login')}
                activeOpacity={0.85}
              >
                <Text style={styles.submitText}>Back to Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.resendRow}
                onPress={() => setSubmitted(false)}
              >
                <Text style={styles.resendText}>Didn't receive it? </Text>
                <Text style={styles.resendLink}>Try again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ── Email entry state ── */
            <View style={styles.formBlock}>
              <View style={styles.titleBlock}>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>
                  Enter your email address and we'll send you a link to reset your
                  password.
                </Text>
              </View>

              {/* Email field */}
              <View style={styles.field}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputRow}>
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color="#777587"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="name@example.com"
                    placeholderTextColor="#777587"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    returnKeyType="done"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Send Reset Link */}
              <TouchableOpacity
                style={[styles.submitBtn, !email && styles.submitBtnDisabled]}
                activeOpacity={email ? 0.85 : 1}
                onPress={() => {
                  if (email) setSubmitted(true);
                }}
              >
                <Text style={styles.submitText}>Send Reset Link</Text>
              </TouchableOpacity>

              {/* Back to Log In */}
              <TouchableOpacity
                style={styles.backToLoginRow}
                onPress={() => router.push('/auth/login')}
              >
                <Text style={styles.backToLoginText}>Back to Log In</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fcf9f8',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backText: {
    fontFamily: 'Manrope',
    fontSize: 20,
    color: '#3525cd',
    letterSpacing: -1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    flexGrow: 1,
  },

  // ── Form block ────────────────────────────────────────────────────────────
  formBlock: {
    gap: 28,
  },
  titleBlock: {
    gap: 12,
  },
  title: {
    fontFamily: 'Manrope',
    fontSize: 30,
    color: '#1c1b1b',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#464555',
    lineHeight: 24,
  },
  emailHighlight: {
    fontFamily: 'InterSemiBold',
    color: '#1c1b1b',
  },
  field: {
    gap: 8,
  },
  label: {
    fontFamily: 'InterMedium',
    fontSize: 14,
    color: '#1c1b1b',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebe7e7',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#1c1b1b',
  },
  submitBtn: {
    backgroundColor: '#3525cd',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 8,
  },
  submitBtnDisabled: {
    backgroundColor: '#b6b4ff',
    elevation: 0,
  },
  submitText: {
    fontFamily: 'InterSemiBold',
    fontSize: 16,
    color: '#fff',
  },
  backToLoginRow: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  backToLoginText: {
    fontFamily: 'InterSemiBold',
    fontSize: 14,
    color: '#3525cd',
  },

  // ── Success block ─────────────────────────────────────────────────────────
  successBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingTop: 48,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e2dfff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#464555',
  },
  resendLink: {
    fontFamily: 'InterSemiBold',
    fontSize: 14,
    color: '#3525cd',
  },
});
