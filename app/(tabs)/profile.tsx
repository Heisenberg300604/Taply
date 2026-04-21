import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from '@/utils/supabase';
import { useAuthStore } from '@/store/authStore';

export default function ProfileEditCard() {
  const { session } = useAuthStore();
  const [name, setName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [links, setLinks] = useState<{ id: string; title: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPronounDropdown, setShowPronounDropdown] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [session]);

  const fetchProfile = async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('name, pronouns, bio, avatar_url, links')
      .eq('id', session.user.id)
      .single();

    if (data) {
      setName(data.name || '');
      setPronouns(data.pronouns || '');
      setBio(data.bio || '');
      setAvatarUrl(data.avatar_url || '');
      setLinks(Array.isArray(data.links) ? data.links : []);
    }
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!session?.user) return;
    
    // Validations
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Display Name is required.');
      return;
    }

    const urlPattern = /^(https?:\/\/)?([\w\d\-_]+)\.([\w\d\-_.]+)\/?(.*)?$/i;
    for (const link of links) {
      if (!link.title.trim() || !link.url.trim()) {
        Alert.alert('Validation Error', 'All links must have a title and URL.');
        return;
      }
      if (!urlPattern.test(link.url.trim()) && !link.url.trim().startsWith('http')) {
         Alert.alert('Validation Error', `Invalid URL format for link: ${link.title}`);
         return;
      }
    }

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        name: name.trim(),
        pronouns: pronouns,
        bio: bio.trim(),
        links: links,
      })
      .eq('id', session.user.id);
      
    setSaving(false);

    if (error) {
      Alert.alert('Error', 'Failed to save profile: ' + error.message);
    } else {
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  const addLink = () => {
    setLinks([...links, { id: Date.now().toString(), title: '', url: '' }]);
  };

  const updateLink = (id: string, key: 'title' | 'url', value: string) => {
    setLinks(links.map(l => l.id === id ? { ...l, [key]: value } : l));
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const handleImageSelection = async (uri: string) => {
    if (!session?.user) return;
    try {
      setUploading(true);
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 400, height: 400 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      const response = await fetch(manipResult.uri);
      const blob = await response.blob();
      
      const fileName = `${session.user.id}/${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) {
        Alert.alert('Upload Error', error.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (publicUrlData) {
        setAvatarUrl(publicUrlData.publicUrl);
        await supabase
          .from('profiles')
          .update({ avatar_url: publicUrlData.publicUrl })
          .eq('id', session.user.id);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'You need to grant permission to access your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      handleImageSelection(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'You need to grant camera permission.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      handleImageSelection(result.assets[0].uri);
    }
  };

  const removeAvatar = async () => {
    if (!session?.user) return;
    setAvatarUrl('');
    await supabase.from('profiles').update({ avatar_url: null }).eq('id', session.user.id);
  };

  const selectAvatar = () => {
    const options: import('react-native').AlertButton[] = [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Gallery', onPress: pickImage },
    ];
    
    if (avatarUrl) {
      options.push({ text: 'Remove Photo', onPress: removeAvatar, style: 'destructive' });
    }

    Alert.alert('Change Avatar', 'Choose an option', options);
  };

  const initials = name ? name.substring(0, 2).toUpperCase() : '??';

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#3525cd" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <View className="items-start gap-y-0.5">
          <Text className="font-manrope text-xl text-primary-container tracking-[-1px]">Taply</Text>
          <Text className="font-inter-medium text-xs text-on-surface-variant">Edit Profile</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={16} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-6 pt-2 pb-12 gap-y-10"
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Section */}
        <View className="items-center gap-y-1 mb-2">
          {uploading ? (
            <View className="w-32 h-32 rounded-full bg-primary-fixed items-center justify-center mb-3">
              <ActivityIndicator color="#3525cd" size="large" />
            </View>
          ) : avatarUrl ? (
            <Image 
              source={{ uri: avatarUrl }} 
              style={{ width: 128, height: 128, borderRadius: 64, borderWidth: 4, borderColor: '#fcf9f8', marginBottom: 12 }} 
              cachePolicy="memory-disk" 
            />
          ) : (
            <View className="w-32 h-32 rounded-full bg-primary-fixed items-center justify-center mb-3 border-[4px] border-background shadow-sm overflow-hidden">
              <Text className="font-manrope text-[40px] text-primary">{initials}</Text>
            </View>
          )}
          <TouchableOpacity className="py-1" onPress={selectAvatar} disabled={uploading}>
            <Text className="font-inter-semibold text-sm text-primary">
              {avatarUrl ? "Change Photo" : "Add Photo"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Basic Info */}
        <View className="gap-y-6 flex-col">
          <Text className="font-manrope text-lg text-on-surface tracking-[-0.45px]">Basic Info</Text>

          {/* Display Name */}
          <View className="gap-y-2 flex-col">
            <Text className="font-inter-medium text-sm text-on-surface-variant">Display Name</Text>
            <View className="relative">
              <TextInput
                className="bg-surface-container-high px-4 py-3 font-inter text-base text-on-surface rounded-lg"
                value={name}
                onChangeText={setName}
                placeholder="Jane Doe"
                placeholderTextColor="#777587"
              />
            </View>
          </View>

          {/* Pronouns */}
          <View className="gap-y-2 flex-col relative z-50">
            <Text className="font-inter-medium text-sm text-on-surface-variant">Pronouns</Text>
            <TouchableOpacity 
              className="bg-surface-container-high px-4 py-3 rounded-lg flex-row justify-between items-center"
              onPress={() => setShowPronounDropdown(!showPronounDropdown)}
            >
              <Text className={`font-inter text-base ${pronouns ? 'text-on-surface' : 'text-[#777587]'}`}>
                {pronouns || "Select pronouns"}
              </Text>
              <Ionicons name={showPronounDropdown ? "chevron-up" : "chevron-down"} size={20} color="#777587" />
            </TouchableOpacity>
            {showPronounDropdown && (
              <View className="absolute top-[75px] left-0 right-0 bg-surface-container-high rounded-lg shadow-sm border border-surface-container-highest z-50 overflow-hidden">
                {['he/him', 'she/her', 'they/them', 'other', 'none'].map((option, idx) => (
                  <TouchableOpacity 
                    key={idx}
                    className="px-4 py-3 border-b border-surface-container-highest flex-row items-center justify-between"
                    onPress={() => { setPronouns(option === 'none' ? '' : option); setShowPronounDropdown(false); }}
                  >
                    <Text className="font-inter text-base text-on-surface">{option}</Text>
                    {pronouns === option && <Ionicons name="checkmark" size={18} color="#3525cd" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Bio */}
          <View className="gap-y-2 flex-col">
            <View className="flex-row items-center justify-between">
              <Text className="font-inter-medium text-sm text-on-surface-variant">Bio</Text>
              <Text className="font-inter text-xs text-outline">{bio.length}/120</Text>
            </View>
            <View className="relative">
              <TextInput
                className="bg-surface-container-high px-4 py-3 font-inter text-base text-on-surface min-h-[80px] rounded-lg"
                value={bio}
                onChangeText={(text) => {
                  if (text.length <= 120) setBio(text);
                }}
                multiline
                numberOfLines={3}
                placeholder="Write your bio..."
                placeholderTextColor="#777587"
                style={{ textAlignVertical: 'top' }}
              />
            </View>
          </View>
        </View>

        {/* Links Manager */}
        <View className="gap-y-6">
          <View className="flex-row items-center justify-between">
            <Text className="font-manrope text-lg text-on-surface tracking-[-0.45px]">Links Manager</Text>
            <TouchableOpacity className="flex-row items-center gap-x-1" onPress={addLink}>
              <Ionicons name="add" size={14} color="#3525cd" />
              <Text className="font-inter-semibold text-sm text-primary tracking-[-0.45px]">Add Link</Text>
            </TouchableOpacity>
          </View>

          {links.map((link) => (
            <View key={link.id} className="flex-row items-center gap-x-3 bg-surface-container-low rounded-xl p-4">
              <Ionicons name="link-outline" size={16} color="#777587" />
              <View className="flex-1 gap-y-2 relative">
                <TextInput
                  className="font-inter-semibold text-sm text-on-surface bg-surface-container-highest px-3 py-2 rounded-lg"
                  value={link.title}
                  onChangeText={(text) => updateLink(link.id, 'title', text)}
                  placeholder="Website Name (e.g. Portfolio)"
                  placeholderTextColor="#777587"
                />
                <TextInput
                  className="font-inter text-xs text-on-surface-variant bg-surface-container-highest px-3 py-2 rounded-lg"
                  value={link.url}
                  onChangeText={(text) => updateLink(link.id, 'url', text)}
                  placeholder="example.com"
                  placeholderTextColor="#777587"
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>
              <TouchableOpacity className="p-2" onPress={() => removeLink(link.id)}>
                <Ionicons name="trash-outline" size={18} color="#ba1a1a" />
              </TouchableOpacity>
            </View>
          ))}
          {links.length === 0 && (
            <Text className="font-inter text-sm text-outline text-center py-4">No links added yet.</Text>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className={`rounded-xl py-4 items-center flex-row justify-center gap-x-2 shadow-sm ${saving ? 'bg-primary/70' : 'bg-primary'}`}
          activeOpacity={0.85}
          onPress={saveProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text className="font-inter-semibold text-base text-on-primary">Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
