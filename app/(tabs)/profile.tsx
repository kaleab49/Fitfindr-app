import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? theme.dark : theme.light;

  // TODO: Replace with actual user data
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    measurements: {
      height: '180',
      weight: '75',
      chest: '100',
      waist: '82',
      hips: '98',
      inseam: '82',
      shoeSize: '43',
    },
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: theme.spacing.md,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    name: {
      ...theme.typography.h2,
      color: colors.text,
      marginBottom: theme.spacing.xs,
    },
    email: {
      ...theme.typography.body,
      color: colors.text,
      marginBottom: theme.spacing.lg,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h3,
      color: colors.text,
      marginBottom: theme.spacing.md,
    },
    measurementRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    measurementLabel: {
      ...theme.typography.body,
      color: colors.text,
    },
    measurementValue: {
      ...theme.typography.body,
      color: colors.primary,
      fontWeight: 'bold',
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
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <FontAwesome name="user" size={50} color={colors.text} />
        </View>
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Body Measurements</Text>
        {Object.entries(userData.measurements).map(([key, value]) => (
          <View key={key} style={styles.measurementRow}>
            <Text style={styles.measurementLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
            <Text style={styles.measurementValue}>{value} {key === 'shoeSize' ? 'EU' : 'cm'}</Text>
          </View>
        ))}

        <Link href="/profile/setup" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Update Measurements</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
} 