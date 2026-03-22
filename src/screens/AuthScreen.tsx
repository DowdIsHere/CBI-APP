import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

type AuthMode = 'signin' | 'signup';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();
  const { showError, showSuccess } = useToast();

  const validateForm = (): boolean => {
    setFormError(null);
    if (!email.trim()) {
      setFormError('Please enter your email address.');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setFormError('Please enter a valid email address.');
      return false;
    }

    if (!password) {
      setFormError('Please enter your password.');
      return false;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return false;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = mode === 'signin'
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);

      if (!result.success) {
        showError(result.error || 'Authentication failed.');
      } else if (result.error) {
        // Success with message (e.g., verification email sent)
        showSuccess(result.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setPassword('');
    setConfirmPassword('');
    setFormError(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo */}
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Mido</Text>
          <Text style={styles.subtitle}>
            {mode === 'signin' ? 'Welcome back!' : 'Create your account'}
          </Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>

            {mode === 'signup' && (
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor="#9ca3af"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
            )}

            {formError && (
              <Text style={styles.formError}>{formError}</Text>
            )}

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Toggle Mode */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.toggleLink}>
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    // Using marginBottom instead of gap for compatibility
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  eyeIcon: {
    padding: 4,
  },
  formError: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  toggleText: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  toggleLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
});
