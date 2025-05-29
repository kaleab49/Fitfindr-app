import { useOAuth, useSignUp } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SignUpScreen() {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? theme.dark : theme.light;
  const { signUp: legacySignUp, error, loading } = useAuth();
  const { signUp, isLoaded } = useSignUp();
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: 'oauth_apple' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setValidationError(null);
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }
    if (signUp && isLoaded) {
      try {
        await signUp.create({ emailAddress: email, password });
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        // Navigate to verification screen here if needed
      } catch (err: any) {
        setValidationError(err.errors?.[0]?.message || 'Something went wrong');
      }
    } else {
      await legacySignUp(email, password ,confirmPassword);
    }
  };

  const handleSocialSignUp = async (provider: 'oauth_google' | 'oauth_apple') => {
    try {
      if (provider === 'oauth_google') {
        await startGoogleOAuth();
      } else if (provider === 'oauth_apple') {
        await startAppleOAuth();
      }
    } catch (err: any) {
      setValidationError('Social sign-up failed');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: theme.spacing.md,
      justifyContent: 'center',
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    socialButtonText: {
      color: colors.text,
      ...theme.typography.accent,
      marginLeft: theme.spacing.sm,
    },
    title: {
      ...theme.typography.h1,
      color: colors.text,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      ...theme.typography.body,
    },
    button: {
      backgroundColor: colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    buttonText: {
      color: colors.buttonText,
      ...theme.typography.accent,
    },
    error: {
      color: colors.error,
      ...theme.typography.body,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
    signInContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing.xl,
    },
    signInText: {
      ...theme.typography.body,
      color: colors.text,
    },
    signInLink: {
      ...theme.typography.accent,
      color: colors.primary,
      marginLeft: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialSignUp('oauth_google')}>
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialSignUp('oauth_apple')}>
        <Text style={styles.socialButtonText}>Continue with Apple</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.text}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.text}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={colors.text}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
      {(error || validationError) && (
        <Text style={styles.error}>{error || validationError}</Text>
      )}
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account?</Text>
        <Link href="/auth/sign-in" asChild>
          <TouchableOpacity>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}