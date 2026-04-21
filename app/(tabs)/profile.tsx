import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileEditCard() {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.logo}>Taply</Text>
          <Text style={styles.headerSub}>Edit Profile</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={16} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Avatar Section ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>SJ</Text>
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* ── Basic Info ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Info</Text>

          {/* Display Name */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Display Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                defaultValue="Sarah Jenkins"
                placeholderTextColor="#777587"
              />
              <View style={styles.inputUnderline} />
            </View>
          </View>

          {/* Pronouns */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Pronouns</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                defaultValue="she/her"
                placeholderTextColor="#777587"
              />
              <View style={styles.inputUnderline} />
            </View>
          </View>

          {/* Bio */}
          <View style={styles.field}>
            <View style={styles.bioLabelRow}>
              <Text style={styles.fieldLabel}>Bio</Text>
              <Text style={styles.charCount}>84/160</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.textarea]}
                defaultValue={
                  'Digital Designer & Art Director based in New York. Passionate about clean interfaces.'
                }
                multiline
                numberOfLines={3}
                placeholderTextColor="#777587"
              />
              <View style={styles.inputUnderline} />
            </View>
          </View>
        </View>

        {/* ── Links Manager ── */}
        <View style={styles.section}>
          <View style={styles.linksSectionHeader}>
            <Text style={styles.sectionTitle}>Links Manager</Text>
            <TouchableOpacity style={styles.addLinkBtn}>
              <Ionicons name="add" size={14} color="#3525cd" />
              <Text style={styles.addLinkText}>Add Link</Text>
            </TouchableOpacity>
          </View>

          {/* Link 1 */}
          <View style={styles.linkItem}>
            <Ionicons name="reorder-two-outline" size={16} color="#777587" />
            <View style={styles.linkContent}>
              <Text style={styles.linkName}>Portfolio Website</Text>
              <Text style={styles.linkUrl}>https://sarahjenkins.design</Text>
            </View>
            <TouchableOpacity style={styles.linkDeleteBtn}>
              <Ionicons name="trash-outline" size={16} color="#777587" />
            </TouchableOpacity>
          </View>

          {/* Link 2 */}
          <View style={styles.linkItem}>
            <Ionicons name="reorder-two-outline" size={16} color="#777587" />
            <View style={styles.linkContent}>
              <Text style={styles.linkName}>LinkedIn</Text>
              <Text style={styles.linkUrl}>https://linkedin.com/in/sarahjenkins</Text>
            </View>
            <TouchableOpacity style={styles.linkDeleteBtn}>
              <Ionicons name="trash-outline" size={16} color="#777587" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Save Button ── */}
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
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
  headerCenter: { alignItems: 'flex-start', gap: 2 },
  logo: { fontFamily: 'Manrope', fontSize: 20, color: '#4f46e5', letterSpacing: -1 },
  headerSub: { fontFamily: 'InterMedium', fontSize: 12, color: '#464555' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 48, gap: 40 },

  // avatar
  avatarSection: { alignItems: 'center', gap: 4 },
  avatarCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#e2dfff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 4,
    borderColor: '#fcf9f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarInitials: { fontFamily: 'Manrope', fontSize: 40, color: '#3525cd' },
  changePhotoBtn: { paddingVertical: 4 },
  changePhotoText: { fontFamily: 'InterSemiBold', fontSize: 14, color: '#3525cd' },

  // sections
  section: { gap: 24 },
  sectionTitle: {
    fontFamily: 'Manrope',
    fontSize: 18,
    color: '#1c1b1b',
    letterSpacing: -0.45,
  },
  linksSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addLinkBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addLinkText: {
    fontFamily: 'InterSemiBold',
    fontSize: 14,
    color: '#3525cd',
    letterSpacing: -0.45,
  },

  // fields
  field: { gap: 4 },
  fieldLabel: { fontFamily: 'InterMedium', fontSize: 14, color: '#464555' },
  bioLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  charCount: { fontFamily: 'Inter', fontSize: 12, color: '#777587' },
  inputWrapper: { position: 'relative' },
  input: {
    backgroundColor: '#ebe7e7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#1c1b1b',
  },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  inputUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'transparent',
  },

  // link items
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f6f3f2',
    borderRadius: 12,
    padding: 16,
  },
  linkContent: { flex: 1, gap: 4 },
  linkName: { fontFamily: 'InterSemiBold', fontSize: 14, color: '#1c1b1b' },
  linkUrl: { fontFamily: 'Inter', fontSize: 12, color: '#464555' },
  linkDeleteBtn: { padding: 8 },

  // save
  saveBtn: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#3525cd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  saveBtnText: { fontFamily: 'InterSemiBold', fontSize: 16, color: '#fff' },
});
