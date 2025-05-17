import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

type BodyMeasurements = {
  height: string;
  weight: string;
  chest: string;
  waist: string;
  hips: string;
  inseam: string;
  shoeSize: string;
};

export default function ProfileSetup() {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? theme.dark : theme.light;

  const [measurements, setMeasurements] = useState<BodyMeasurements>({
    height: '',
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    inseam: '',
    shoeSize: '',
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving measurements:', measurements);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: theme.spacing.md,
    },
    title: {
      ...theme.typography.h2,
      color: colors.text,
      marginBottom: theme.spacing.lg,
    },
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    label: {
      ...theme.typography.body,
      color: colors.text,
      marginBottom: theme.spacing.xs,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.sm,
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
      marginTop: theme.spacing.lg,
    },
    buttonText: {
      color: colors.buttonText,
      ...theme.typography.accent,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile Setup</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          value={measurements.height}
          onChangeText={(text) => setMeasurements({ ...measurements, height: text })}
          keyboardType="numeric"
          placeholderTextColor={colors.text}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={measurements.weight}
          onChangeText={(text) => setMeasurements({ ...measurements, weight: text })}
          keyboardType="numeric"
          placeholderTextColor={colors.text}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Chest (cm)</Text>
        <TextInput
          style={styles.input}
          value={measurements.chest}
          onChangeText={(text) => setMeasurements({ ...measurements, chest: text })}
          keyboardType="numeric"
          placeholderTextColor={colors.text}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Waist (cm)</Text>
        <TextInput
          style={styles.input}
          value={measurements.waist}
          onChangeText={(text) => setMeasurements({ ...measurements, waist: text })}
          keyboardType="numeric"
          placeholderTextColor={colors.text}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hips (cm)</Text>
        <TextInput
          style={styles.input}
          value={measurements.hips}
          onChangeText={(text) => setMeasurements({ ...measurements, hips: text })}
          keyboardType="numeric"
          placeholderTextColor={colors.text}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Inseam (cm)</Text>
        <TextInput
          style={styles.input}
          value={measurements.inseam}
          onChangeText={(text) => setMeasurements({ ...measurements, inseam: text })}
          keyboardType="numeric"
          placeholderTextColor={colors.text}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Shoe Size (EU)</Text>
        <TextInput
          style={styles.input}
          value={measurements.shoeSize}
          onChangeText={(text) => setMeasurements({ ...measurements, shoeSize: text })}
          keyboardType="numeric"
          placeholderTextColor={colors.text}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
} 