import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  {
    name: 'home',
    label: 'My Card',
    icon: 'card-outline' as const,
    activeIcon: 'card' as const,
  },
  {
    name: 'analytics',
    label: 'Insights',
    icon: 'bar-chart-outline' as const,
    activeIcon: 'bar-chart' as const,
  },
  {
    name: 'profile',
    label: 'Profile',
    icon: 'person-outline' as const,
    activeIcon: 'person' as const,
  },
  {
    name: 'settings',
    label: 'Settings',
    icon: 'settings-outline' as const,
    activeIcon: 'settings' as const,
  },
];

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      {state.routes.map((route, index) => {
        const tab = TABS[index];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.tabBtn, isFocused && styles.tabBtnActive]}
            activeOpacity={0.75}
          >
            <Ionicons
              name={isFocused ? tab.activeIcon : tab.icon}
              size={20}
              color={isFocused ? '#4338CA' : '#A8A29E'}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 8,
    shadowColor: '#1c1b1b',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 16,
    alignItems: 'center',
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    gap: 4,
  },
  tabBtnActive: {
    backgroundColor: '#EEF2FF',
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Manrope',
    color: '#A8A29E',
    letterSpacing: -0.25,
  },
  tabLabelActive: {
    color: '#4338CA',
  },
});

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="analytics" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
