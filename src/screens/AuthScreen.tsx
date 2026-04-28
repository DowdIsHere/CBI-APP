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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'signin' | 'signup';
type FeedbackTone = 'error' | 'success' | 'info';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: FeedbackTone; message: string } | null>(null);

  const { signIn, signUp } = useAuth();

  const validateForm = (): string | null => {
    if (!email.trim()) return 'Please enter your email address.';
    if (!email.includes('@') || !email.includes('.')) return 'Please enter a valid email address.';
    if (!password) return 'Please enter your password.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (mode === 'signup' && password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFeedback({ tone: 'error', message: validationError });
      return;
    }

    setFeedback(null);
    setIsLoading(true);

    try {
      const result = mode === 'signin'
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);

      if (!result.success) {
        setFeedback({ tone: 'error', message: result.error || 'Authentication failed.' });
        return;
      }

      // Success with message means email verification required (no session yet).
      // Switch to sign-in mode so the user can sign in once they verify.
      if (result.error) {
        setFeedback({ tone: 'info', message: result.error });
        if (mode === 'signup') {
          setMode('signin');
          setConfirmPassword('');
        }
      }
      // Otherwise, isAuthenticated will flip to true in AuthContext and App.tsx
      // will navigate away from this screen automatically.
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setFeedback({ tone: 'error', message });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setPassword('');
    setConfirmPassword('');
    setFeedback(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

            {feedback && (() => {
              const toneStyles = {
                error: { box: styles.feedback_error, text: styles.feedbackText_error, color: '#b91c1c', icon: 'alert-circle' as const },
                success: { box: styles.feedback_success, text: styles.feedbackText_success, color: '#047857', icon: 'checkmark-circle' as const },
                info: { box: styles.feedback_info, text: styles.feedbackText_info, color: '#1d4ed8', icon: 'information-circle' as const },
              }[feedback.tone];
              return (
                <View style={[styles.feedback, toneStyles.box]}>
                  <Ionicons name={toneStyles.icon} size={18} color={toneStyles.color} style={styles.feedbackIcon} />
                  <Text style={[styles.feedbackText, toneStyles.text]}>{feedback.message}</Text>
                </View>
              );
            })()}

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
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
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
  feedback: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  feedback_error: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  feedback_success: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  feedback_info: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  feedbackIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  feedbackText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  feedbackText_error: {
    color: '#b91c1c',
  },
  feedbackText_success: {
    color: '#047857',
  },
  feedbackText_info: {
    color: '#1d4ed8',
  },
});
