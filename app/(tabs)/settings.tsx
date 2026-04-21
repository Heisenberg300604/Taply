import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

// ─── Settings items ───────────────────────────────────────────────────────────
const SETTINGS = [
  {
    id: 'account',
    icon: 'person-outline' as IoniconsName,
    title: 'Account Settings',
    desc: 'Update your email, password, and personal info',
  },
  {
    id: 'security',
    icon: 'shield-checkmark-outline' as IoniconsName,
    title: 'Security',
    desc: 'Two-factor authentication and login history',
  },
  {
    id: 'privacy',
    icon: 'document-text-outline' as IoniconsName,
    title: 'Privacy Policy',
    desc: 'Review how we handle your data',
  },
  {
    id: 'help',
    icon: 'help-circle-outline' as IoniconsName,
    title: 'Help & Support',
    desc: 'FAQs, contact us, and troubleshooting',
  },
];

export default function Settings() {
  const { signOut } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action is permanent and cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Empty function for now - no actual deletion
            console.log('Account deletion requested (not implemented)');
          },
        },
      ]
    );
  };

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
        {/* ── Page Title ── */}
        <View style={styles.pageTitle}>
          <Text style={styles.pageTitleText}>Settings</Text>
          <Text style={styles.pageTitleSub}>
            Manage your Taply experience and security preferences.
          </Text>
        </View>

        {/* ── Settings List ── */}
        <View style={styles.settingsList}>
          {SETTINGS.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.settingItem} 
              activeOpacity={0.75}
              onPress={() => router.push('/coming-soon')}
            >
              {/* Icon bg */}
              <View style={styles.iconBg}>
                <Ionicons name={item.icon} size={18} color="#3525cd" />
              </View>
              {/* Text */}
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingDesc}>{item.desc}</Text>
              </View>
              {/* Chevron */}
              <Ionicons name="chevron-forward" size={16} color="#c7c4d8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Danger Zone ── */}
        <View style={styles.dangerZone}>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#ba1a1a" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.8} onPress={handleDeleteAccount}>
            <Ionicons name="trash-outline" size={18} color="#ba1a1a" />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fcf9f8' },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logo: { fontFamily: 'Manrope', fontSize: 20, color: '#4f46e5', letterSpacing: -1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 48, gap: 32 },

  // page title
  pageTitle: { gap: 8 },
  pageTitleText: {
    fontFamily: 'Manrope',
    fontSize: 30,
    color: '#1c1b1b',
    letterSpacing: -0.75,
  },
  pageTitleSub: { fontFamily: 'Inter', fontSize: 16, color: '#464555', lineHeight: 24 },

  // settings list
  settingsList: { gap: 16 },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f6f3f2',
    borderRadius: 12,
    padding: 20,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#e5e2e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: { flex: 1, gap: 2 },
  settingTitle: { fontFamily: 'Manrope', fontSize: 17, color: '#1c1b1b' },
  settingDesc: { fontFamily: 'Inter', fontSize: 14, color: '#464555', lineHeight: 20 },

  // danger zone
  dangerZone: { gap: 12, paddingTop: 16 },
  dangerLabel: {
    fontFamily: 'Manrope',
    fontSize: 12,
    color: '#ba1a1a',
    letterSpacing: 0.6,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,218,214,0.3)',
    borderRadius: 8,
    paddingVertical: 16,
  },
  logoutText: {
    fontFamily: 'InterSemiBold',
    fontSize: 16,
    color: '#ba1a1a',
    textAlign: 'center',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: 'rgba(186,26,26,0.2)',
  },
  deleteText: {
    fontFamily: 'InterSemiBold',
    fontSize: 16,
    color: '#ba1a1a',
    textAlign: 'center',
  },
});