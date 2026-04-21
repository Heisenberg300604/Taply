import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { supabase } from '@/utils/supabase';
import { useAuthStore } from '@/store/authStore';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Clipboard from 'expo-clipboard';

export default function HomeMyCard() {
  const { session } = useAuthStore();
  const [profile, setProfile] = useState<{ name: string; pronouns: string; avatar_url: string; role: string; username: string } | null>(null);
  const cardRef = useRef<View>(null);

  useEffect(() => {
    if (session?.user) {
      supabase.from('profiles').select('name, pronouns, avatar_url, username').eq('id', session.user.id).single().then(({ data }) => {
        if (data) {
          setProfile({
            name: data.name || 'Anonymous User',
            pronouns: data.pronouns || '',
            avatar_url: data.avatar_url || '',
            username: data.username || '',
            role: 'Software Engineer', // Keeping default role until db field added
          });
        }
      });
    }
  }, [session]);

  const initials = profile?.name ? profile.name.substring(0, 2).toUpperCase() : '??';
  const profileUrl = profile?.username ? `https://taply-profiles.vercel.app/u/${profile.username}` : 'https://taply-profiles.vercel.app/';

  const shareCard = async () => {
    try {
      if (cardRef.current) {
        const uri = await captureRef(cardRef, {
          format: 'png',
          quality: 1,
        });
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share your Taply card',
        });
      }
    } catch (err) {
      Alert.alert('Error sharing', String(err));
    }
  };

  const saveCard = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to save photos.');
        return;
      }
      
      if (cardRef.current) {
        const uri = await captureRef(cardRef, {
          format: 'png',
          quality: 1,
        });
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Saved', 'Card saved to your photos.');
      }
    } catch (err) {
      Alert.alert('Error saving', String(err));
    }
  };

  const copyLink = async () => {
    await Clipboard.setStringAsync(profileUrl);
    Alert.alert('Link Copied', 'Profile link copied to clipboard!');
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
        {/* ── Header Text ── */}
        <View style={styles.headerText}>
          {profile?.avatar_url ? (
            <Image 
              source={{ uri: profile.avatar_url }} 
              style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 8 }} 
              cachePolicy="memory-disk" 
            />
          ) : (
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#e5e2e1', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Text style={{ fontFamily: 'Manrope', fontSize: 24, color: '#3525cd' }}>{initials}</Text>
            </View>
          )}
          <Text style={styles.name}>{profile?.name || 'Loading...'}</Text>
          <Text style={styles.role}>
            {profile?.role || 'Software Engineer'}
            {profile?.pronouns ? ` • ${profile.pronouns}` : ''}
          </Text>
        </View>

        {/* ── Card Area ── */}
        <View style={styles.cardArea} ref={cardRef} collapsable={false}>
          <Text style={styles.cardHint}>Scan this to view my profile</Text>

          {/* QR Code */}
          <View style={styles.qrWrapper}>
            <QRCode 
              value={profileUrl}
              size={192}
              color="#3525cd"
              backgroundColor="#fff"
            />
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
          <TouchableOpacity style={styles.shareBtn} activeOpacity={0.85} onPress={shareCard}>
            <Ionicons name="share-outline" size={20} color="#fff" />
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>

          {/* Save */}
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8} onPress={saveCard}>
            <Ionicons name="download-outline" size={18} color="#1c1b1b" />
            <Text style={styles.secondaryBtnText}>Save</Text>
          </TouchableOpacity>

          {/* Copy Link */}
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8} onPress={copyLink}>
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
