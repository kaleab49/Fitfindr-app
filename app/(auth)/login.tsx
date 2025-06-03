import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen() {
  const { isDarkMode, colors } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  
  // Hide header for this screen
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }
  , [navigation]);
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={[
          isDarkMode ? colors.dark.surface : colors.light.surface,
          isDarkMode ? colors.dark.background : colors.light.background,
        ]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Ionicons 
              name="fitness" 
              size={80} 
              color={colors.primary} 
            />
            <Text style={[styles.title, { color: isDarkMode ? colors.textLight : colors.textDark }]}>
              FitFindr
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={[styles.inputContainer, { 
              backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
              borderColor: isDarkMode ? colors.textLight + '20' : colors.textDark + '20'
            }]}>
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={isDarkMode ? colors.textLight : colors.textDark} 
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: isDarkMode ? colors.textLight : colors.textDark }]}
                placeholder="Email"
                placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={[styles.inputContainer, { 
              backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
              borderColor: isDarkMode ? colors.textLight + '20' : colors.textDark + '20'
            }]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={isDarkMode ? colors.textLight : colors.textDark} 
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: isDarkMode ? colors.textLight : colors.textDark }]}
                placeholder="Password"
                placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: colors.primary }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={[styles.loginButtonText, { color: '#FFFFFF' }]}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signUpButton}
              onPress={() => router.push('/signup')}
            >
              <Text style={[styles.signUpText, { color: colors.primary }]}>
                Don't have an account? Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontFamily: 'playsans',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: 'Sora-Regular',
  },
  loginButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'playsans',
  },
  signUpButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
  },
}); 