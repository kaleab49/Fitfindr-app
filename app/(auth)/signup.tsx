import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../context/ThemeContext';

export default function SignUpScreen() {
  const { isDarkMode, colors } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create user profile in the database
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: authData.user.id,
            email: email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (profileError) throw profileError;

        Alert.alert(
          'Success', 
          'Account created successfully! Please check your email for verification.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/login')
            }
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred during sign up');
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
              Create Account
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
                placeholder="Confirm Password"
                placeholderTextColor={isDarkMode ? colors.textLight + '80' : colors.textDark + '80'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, { backgroundColor: colors.primary }]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={[styles.signUpButtonText, { color: '#FFFFFF' }]}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/login')}
            >
              <Text style={[styles.loginText, { color: colors.primary }]}>
                Already have an account? Sign in
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
    fontFamily: 'Sora-Bold',
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
  signUpButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
  },
  loginButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
  },
}); 