import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
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
import { useTheme } from '../context/ThemeContext';

export default function VerifyEmailScreen() {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? theme.dark : theme.light;
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerification = async () => {
    if (!isLoaded) return;
    
    setError(null);
    setLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === 'complete') {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: theme.spacing.md,
      justifyContent: 'center',
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
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={[styles.error, { color: colors.text }]}>
        Please enter the verification code sent to your email
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        placeholderTextColor={colors.text}
        value={code}
        onChangeText={setCode}
        autoCapitalize="none"
        keyboardType="number-pad"
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleVerification}
        disabled={loading || !isLoaded}
      >
        {loading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={styles.buttonText}>Verify Email</Text>
        )}
      </TouchableOpacity>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
} 