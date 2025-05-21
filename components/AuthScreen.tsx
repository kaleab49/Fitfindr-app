import React, { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../app/context/AuthContext';

// Main authentication screen component
export const AuthScreen: React.FC = () => {
  // State variables
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login and signup
  const [email, setEmail] = useState('');        // Email input
  const [password, setPassword] = useState('');  // Password input
  const [name, setName] = useState('');          // Name input (for signup)
  const [error, setError] = useState<string | null>(null);  // Error message
  
  // Get authentication functions from context
  const { signIn, signUp, loading } = useAuth();

  // Handle form submission
  const handleSubmit = async () => {
    // Clear any previous errors
    setError(null);

    // Check if required fields are filled
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Check name for signup
    if (!isLogin && !name) {
      setError('Please enter your name');
      return;
    }

    try {
      // Call appropriate auth function
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* Title */}
        <Text style={styles.title}>
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </Text>

        {/* Login/Signup Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isLogin && styles.activeToggle]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isLogin && styles.activeToggle]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.toggleText, !isLogin && styles.activeToggleText]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Name input (only for signup) */}
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#666"
          />
        )}

        {/* Email input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#666"
        />

        {/* Password input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#666"
        />

        {/* Submit button */}
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isLogin ? 'Login' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Error message */}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Form container
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  // Title text
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // Login/Signup toggle container
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    marginBottom: 20,
    padding: 4,
  },
  
  // Toggle button
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 22,
  },
  
  // Active toggle button
  activeToggle: {
    backgroundColor: '#007AFF',
  },
  
  // Toggle text
  toggleText: {
    color: '#666',
    fontSize: 16,
  },
  
  // Active toggle text
  activeToggleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Input fields
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  
  // Submit button
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  
  // Disabled submit button
  submitButtonDisabled: {
    opacity: 0.7,
  },
  
  // Submit button text
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Error message
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
}); 