import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { theme } from '../constants/theme';
export default function Settings() {
  const { isDarkMode, colors } = useTheme();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigation = useNavigation();
  
    useLayoutEffect(() => {
      navigation.setOptions({ 
            headerShown: true,
            headerBackVisible: true,
            headerTitle: "Settings",
            headerStyle: {
              backgroundColor: theme.background,
            },
            headerTintColor: isDarkMode ? colors.textLight : colors.textDark,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
              color: isDarkMode ? colors.textLight : colors.textDark,
            },
            headerShadowVisible: false,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <Text style={{ color: isDarkMode ? colors.textLight : colors.textDark }}>Back</Text>
            ),  
          });
        }, [navigation,]);
  const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to logout');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.dark.background : colors.light.background }]}>
      <Text style={[styles.header, { color: isDarkMode ? colors.textLight : colors.textDark }]}>Settings</Text>

      {/* Notifications Toggle */}
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: isDarkMode ? colors.textLight : colors.textDark }]}>Enable Notifications</Text>
        <Switch 
          value={notificationsEnabled} 
          onValueChange={toggleNotifications}
          trackColor={{ false: colors.accent3, true: colors.primary }}
          thumbColor={notificationsEnabled ? colors.accent1 : colors.accent2}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: colors.accent3 }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutButtonText, { color: '#FFFFFF' }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'playsans',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 18,
    fontFamily: 'playsans',
  },
  logoutButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'playsans',
  },
});

