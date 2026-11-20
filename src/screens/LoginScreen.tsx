import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context';
import { useNavigation } from '../navigation';

export const LoginScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useAuth();
  const { navigate, resetTo } = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const handleLogin = async () => {
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('Please enter your work email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      const success = await login(email.trim(), password);
      if (success) {
        resetTo('Home');
      }
    } catch {
      setErrorMessage('Authentication failed. Please verify your credentials.');
    }
  };

  const fillDemoCredentials = () => {
    setEmail('john.doe@company.io');
    setPassword('Workspace2026!');
    setErrorMessage('');
  };

  const topPadding =
    Platform.OS === 'android'
      ? Math.max(insets.top, StatusBar.currentHeight || 0) + 16
      : insets.top + 16;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: topPadding,
            paddingBottom: insets.bottom + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Brand Emblem */}
        <View style={styles.brandHeader}>
          <View style={styles.brandEmblemBox}>
            <Text style={styles.brandEmblemGlyph}>◈</Text>
          </View>
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandTitleMain}>MY</Text>
            <Text style={styles.brandTitleAccent}>APP</Text>
          </View>
          <Text style={styles.brandTagline}>ENTERPRISE WORKSPACE OS</Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Sign in to your account</Text>
          <Text style={styles.welcomeSubtitle}>
            Access your team projects, matrices, and AI intelligence
          </Text>
        </View>

        {/* Error Notice */}
        {errorMessage ? (
          <View style={styles.errorBanner}>
            <View style={styles.errorIndicator} />
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Input Fields */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Work Email</Text>
            <View
              style={[
                styles.inputWrapper,
                isFocusedEmail && styles.inputWrapperFocused,
              ]}
            >
              {/* Mail Icon Glyph */}
              <View style={styles.inputIconBox}>
                <View style={styles.vectorMailOutline}>
                  <View style={styles.vectorMailFlap} />
                </View>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="name@company.io"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  if (errorMessage) {
                    setErrorMessage('');
                  }
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                onFocus={() => setIsFocusedEmail(true)}
                onBlur={() => setIsFocusedEmail(false)}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <View style={styles.passwordLabelRow}>
              <Text style={styles.inputLabel}>Password</Text>
              <TouchableOpacity
                onPress={() =>
                  setErrorMessage(
                    'Password reset instructions sent to your email.',
                  )
                }
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.inputWrapper,
                isFocusedPassword && styles.inputWrapperFocused,
              ]}
            >
              {/* Lock Icon Glyph */}
              <View style={styles.inputIconBox}>
                <View style={styles.vectorLockShackle} />
                <View style={styles.vectorLockBody} />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="••••••••••••"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  if (errorMessage) {
                    setErrorMessage('');
                  }
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                onFocus={() => setIsFocusedPassword(true)}
                onBlur={() => setIsFocusedPassword(false)}
              />
              <TouchableOpacity
                style={styles.eyeToggleButton}
                onPress={() => setShowPassword(prev => !prev)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.eyeToggleText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me Checkbox */}
          <TouchableOpacity
            style={styles.rememberRow}
            activeOpacity={0.8}
            onPress={() => setRememberMe(prev => !prev)}
          >
            <View
              style={[
                styles.customCheckbox,
                rememberMe && styles.customCheckboxActive,
              ]}
            >
              {rememberMe && <Text style={styles.checkmarkGlyph}>✓</Text>}
            </View>
            <Text style={styles.rememberText}>Keep me signed in</Text>
          </TouchableOpacity>

          {/* Primary Sign In Button */}
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign In to Workspace</Text>
            )}
          </TouchableOpacity>

          {/* 1-Tap Demo Credentials Pill */}
          <TouchableOpacity
            style={styles.demoFillPill}
            activeOpacity={0.8}
            onPress={fillDemoCredentials}
          >
            <View style={styles.demoDot} />
            <Text style={styles.demoFillText}>
              1-Tap Demo Credentials (john.doe@company.io)
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* SSO Buttons */}
          <View style={styles.ssoRow}>
            {/* Google Workspace SSO */}
            <TouchableOpacity
              style={styles.ssoButton}
              activeOpacity={0.7}
              onPress={async () => {
                await login('john.doe@company.io', 'GoogleSSO');
                resetTo('Home');
              }}
            >
              <Text style={styles.ssoGlyph}>G</Text>
              <Text style={styles.ssoButtonText}>Google</Text>
            </TouchableOpacity>

            {/* Apple ID */}
            <TouchableOpacity
              style={styles.ssoButton}
              activeOpacity={0.7}
              onPress={async () => {
                await login('john.doe@company.io', 'AppleSSO');
                resetTo('Home');
              }}
            >
              <Text style={styles.ssoGlyph}></Text>
              <Text style={styles.ssoButtonText}>Apple</Text>
            </TouchableOpacity>

            {/* Enterprise SAML / SSO */}
            <TouchableOpacity
              style={styles.ssoButton}
              activeOpacity={0.7}
              onPress={async () => {
                await login('john.doe@company.io', 'EnterpriseSAML');
                resetTo('Home');
              }}
            >
              <Text style={styles.ssoGlyph}>◈</Text>
              <Text style={styles.ssoButtonText}>SAML</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Link to Register */}
        <View style={styles.footerRow}>
          <Text style={styles.footerPromptText}>
            Don&rsquo;t have a workspace account?
          </Text>
          <TouchableOpacity
            onPress={() => navigate('Register')}
            activeOpacity={0.7}
          >
            <Text style={styles.footerActionText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  // Brand Header
  brandHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brandEmblemBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  brandEmblemGlyph: {
    fontSize: 22,
    color: '#818CF8',
    fontWeight: '800',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitleMain: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
    color: '#0F172A',
  },
  brandTitleAccent: {
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: 4,
    color: '#4F46E5',
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#64748B',
    marginTop: 4,
  },
  // Welcome Text
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  // Error Banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
    gap: 10,
  },
  errorIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  errorBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B91C1C',
    flex: 1,
  },
  // Form Container
  formContainer: {
    gap: 18,
    marginBottom: 28,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#334155',
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
  },
  inputWrapperFocused: {
    borderColor: '#4F46E5',
    backgroundColor: '#FFFFFF',
  },
  inputIconBox: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  // Vector Mail Glyph
  vectorMailOutline: {
    width: 16,
    height: 12,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: '#64748B',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  vectorMailFlap: {
    width: 8,
    height: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#64748B',
  },
  // Vector Lock Glyph
  vectorLockShackle: {
    width: 8,
    height: 6,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: '#64748B',
    marginBottom: -1,
  },
  vectorLockBody: {
    width: 14,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#64748B',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    paddingVertical: 0,
  },
  eyeToggleButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  eyeToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  // Remember Me
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customCheckboxActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  checkmarkGlyph: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  rememberText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  // Primary Button
  primaryButton: {
    height: 50,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  // 1-Tap Demo Pill
  demoFillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    gap: 8,
  },
  demoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4F46E5',
  },
  demoFillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#94A3B8',
  },
  // SSO Row
  ssoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ssoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    gap: 6,
  },
  ssoGlyph: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  ssoButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  // Footer
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  footerPromptText: {
    fontSize: 13,
    color: '#64748B',
  },
  footerActionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
  },
});
