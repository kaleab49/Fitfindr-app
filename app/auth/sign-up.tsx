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
  const { signUp, error, loading } = useAuth();
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

    await signUp(email, password);
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