import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { theme } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function SignInScreen() {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? theme.dark : theme.light;
  const { signIn, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    await signIn(email, password);
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
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing.xl,
    },
    signUpText: {
      ...theme.typography.body,
      color: colors.text,
    },
    signUpLink: {
      ...theme.typography.accent,
      color: colors.primary,
      marginLeft: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

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

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <Link href="/auth/sign-up" asChild>
          <TouchableOpacity>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
} 