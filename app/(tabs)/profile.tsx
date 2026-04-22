import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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

      const fileName = `${session.user.id}/${Date.now()}.jpg`;

      const formData = new FormData();
      formData.append('file', {
        uri: manipResult.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, formData, {
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
        <View className="items-start gap-y-1">
          <Text style={{ fontFamily: 'Manrope', fontSize: 24, fontWeight: '900', color: '#4f46e5', letterSpacing: -1 }}>Taply</Text>
          <Text className="font-inter-medium text-sm text-on-surface-variant">Edit Profile</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-6 pt-4 pb-12 gap-y-12"
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Section */}
        <View className="items-center gap-y-2 mb-2">
          {uploading ? (
            <View className="w-32 h-32 rounded-full bg-surface-container-high items-center justify-center mb-2">
              <ActivityIndicator color="#3525cd" size="large" />
            </View>
          ) : avatarUrl ? (
            <Image 
              source={{ uri: avatarUrl }} 
              style={{ width: 128, height: 128, borderRadius: 64, borderWidth: 4, borderColor: '#fcf9f8', marginBottom: 8 }} 
              cachePolicy="memory-disk" 
            />
          ) : (
            <View className="w-32 h-32 rounded-full bg-surface-container-high items-center justify-center mb-2 border-[4px] border-background shadow-sm overflow-hidden">
              <Text className="font-manrope text-[40px] text-primary">{initials}</Text>
            </View>
          )}
          <TouchableOpacity className="py-2 px-6 rounded-full bg-surface-container-low" onPress={selectAvatar} disabled={uploading}>
            <Text className="font-inter-semibold text-sm text-primary">
              {avatarUrl ? "Change Photo" : "Add Photo"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Basic Info */}
        <View className="gap-y-6 flex-col">
          <Text className="font-manrope text-xl text-on-surface tracking-tight">Basic Info</Text>

          {/* Display Name */}
          <View className="gap-y-3 flex-col">
            <Text className="font-inter-semibold text-sm text-on-surface-variant">Display Name</Text>
            <View className="relative">
              <TextInput
                className="bg-surface-container-high px-4 py-4 font-inter text-base text-on-surface rounded-xl"
                value={name}
                onChangeText={setName}
                placeholder="Jane Doe"
                placeholderTextColor="#777587"
              />
            </View>
          </View>

          {/* Pronouns */}
          <View className="gap-y-3 flex-col relative z-50">
            <Text className="font-inter-semibold text-sm text-on-surface-variant">Pronouns</Text>
            <TouchableOpacity 
              className="bg-surface-container-high px-4 py-4 rounded-xl flex-row justify-between items-center"
              onPress={() => setShowPronounDropdown(!showPronounDropdown)}
            >
              <Text className={`font-inter text-base ${pronouns ? 'text-on-surface' : 'text-[#777587]'}`}>
                {pronouns || "Select pronouns"}
              </Text>
              <Ionicons name={showPronounDropdown ? "chevron-up" : "chevron-down"} size={22} color="#777587" />
            </TouchableOpacity>
            {showPronounDropdown && (
              <View className="absolute top-[85px] left-0 right-0 bg-surface-container-high rounded-xl shadow-md border border-surface-container-highest z-50 overflow-hidden">
                {['he/him', 'she/her', 'they/them', 'other', 'none'].map((option, idx) => (
                  <TouchableOpacity 
                    key={idx}
                    className="px-5 py-4 border-b border-surface-container-highest flex-row items-center justify-between"
                    onPress={() => { setPronouns(option === 'none' ? '' : option); setShowPronounDropdown(false); }}
                  >
                    <Text className="font-inter text-base text-on-surface">{option}</Text>
                    {pronouns === option && <Ionicons name="checkmark" size={20} color="#3525cd" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Bio */}
          <View className="gap-y-3 flex-col relative z-40">
            <View className="flex-row items-center justify-between">
              <Text className="font-inter-semibold text-sm text-on-surface-variant">Bio</Text>
              <Text className="font-inter text-xs text-outline">{bio.length}/120</Text>
            </View>
            <View className="relative">
              <TextInput
                className="bg-surface-container-high px-4 py-4 font-inter text-base text-on-surface min-h-[100px] rounded-xl"
                value={bio}
                onChangeText={(text) => {
                  if (text.length <= 120) setBio(text);
                }}
                multiline
                numberOfLines={4}
                placeholder="Write your bio..."
                placeholderTextColor="#777587"
                style={{ textAlignVertical: 'top' }}
              />
            </View>
          </View>
        </View>

        {/* Links Manager */}
        <View className="gap-y-6 flex-col relative z-10">
          <View className="flex-row items-center justify-between">
            <Text className="font-manrope text-xl text-on-surface tracking-tight">Social Links</Text>
            <TouchableOpacity className="flex-row items-center gap-x-1 py-1.5 px-3 rounded-lg bg-[#e2dfff]" onPress={addLink}>
              <Ionicons name="add" size={18} color="#3525cd" />
              <Text className="font-inter-semibold text-sm text-[#3525cd]">Add Link</Text>
            </TouchableOpacity>
          </View>

          {links.map((link) => (
            <View key={link.id} className="flex-col gap-y-3 bg-surface-container-low rounded-2xl p-5 border border-surface-container-highest">
              <View className="flex-row justify-between items-center mb-1">
                <View className="flex-row items-center gap-x-2">
                  <Ionicons name="link-outline" size={20} color="#777587" />
                  <Text className="font-inter-semibold text-sm text-on-surface-variant">Link Item</Text>
                </View>
                <TouchableOpacity className="p-3 bg-red-50 rounded-full" onPress={() => removeLink(link.id)}>
                  <Ionicons name="trash-outline" size={18} color="#ba1a1a" />
                </TouchableOpacity>
              </View>
              
              <TextInput
                className="font-inter text-base text-on-surface bg-surface-container-highest px-4 py-4 rounded-xl"
                value={link.title}
                onChangeText={(text) => updateLink(link.id, 'title', text)}
                placeholder="Title (e.g. Portfolio)"
                placeholderTextColor="#777587"
              />
              <TextInput
                className="font-inter text-base text-on-surface bg-surface-container-highest px-4 py-4 rounded-xl"
                value={link.url}
                onChangeText={(text) => updateLink(link.id, 'url', text)}
                placeholder="URL (e.g. https://domain.com)"
                placeholderTextColor="#777587"
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
          ))}
          {links.length === 0 && (
            <View className="py-10 bg-surface-container-low rounded-2xl items-center justify-center border border-dashed border-surface-container-highest">
                <Text className="font-inter text-base text-outline text-center">No links added yet.</Text>
            </View>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className={`rounded-2xl py-5 items-center flex-row justify-center gap-x-2 shadow-sm ${saving ? 'bg-primary/70' : 'bg-primary'}`}
          activeOpacity={0.85}
          onPress={saveProfile}
          disabled={saving}
          style={{ elevation: 4 }}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text className="font-inter-semibold text-[17px] text-on-primary">Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
