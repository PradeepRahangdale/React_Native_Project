import React, { useMemo, useState } from 'react';
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

export const RegisterScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { register, isLoading } = useAuth();
  const { navigate, resetTo } = useNavigation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedOrg, setIsFocusedOrg] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  // Dynamic Password Strength Meter
  const passwordStrength = useMemo(() => {
    if (!password) {
      return { score: 0, label: '', color: '#CBD5E1' };
    }
    let score = 0;
    if (password.length >= 8) {
      score += 1;
    }
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
      score += 1;
    }
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    }

    if (score === 1) {
      return { score: 1, label: 'Weak', color: '#EF4444' };
    }
    if (score === 2) {
      return { score: 2, label: 'Good', color: '#F59E0B' };
    }
    return { score: 3, label: 'Strong', color: '#10B981' };
  }, [password]);

  const handleRegister = async () => {
    setErrorMessage('');
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }
    if (!organization.trim()) {
      setErrorMessage('Please specify your organization or company.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('Please accept the Terms of Service to continue.');
      return;
    }

    try {
      const success = await register(
        fullName.trim(),
        email.trim(),
        organization.trim(),
        password,
      );
      if (success) {
        resetTo('Home');
      }
    } catch {
      setErrorMessage('Account creation failed. Please try again.');
    }
  };

  const fillDemoRegistration = () => {
    setFullName('Sarah Connor');
    setEmail('sarah.c@cyberdyne.io');
    setOrganization('Cyberdyne Systems');
    setPassword('Cyberdyne2026!');
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

        {/* Header Text */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Create workspace account</Text>
          <Text style={styles.headerSubtitle}>
            Setup your collaborative environment and connect your team
          </Text>
        </View>

        {/* Error Notice */}
        {errorMessage ? (
          <View style={styles.errorBanner}>
            <View style={styles.errorIndicator} />
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View
              style={[
                styles.inputWrapper,
                isFocusedName && styles.inputWrapperFocused,
              ]}
            >
              {/* User Glyph */}
              <View style={styles.inputIconBox}>
                <View style={styles.vectorUserCircle} />
                <View style={styles.vectorUserArch} />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Sarah Connor"
                placeholderTextColor="#94A3B8"
                value={fullName}
                onChangeText={text => {
                  setFullName(text);
                  if (errorMessage) {
                    setErrorMessage('');
                  }
                }}
                autoCapitalize="words"
                onFocus={() => setIsFocusedName(true)}
                onBlur={() => setIsFocusedName(false)}
              />
            </View>
          </View>

          {/* Work Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Work Email</Text>
            <View
              style={[
                styles.inputWrapper,
                isFocusedEmail && styles.inputWrapperFocused,
              ]}
            >
              {/* Mail Glyph */}
              <View style={styles.inputIconBox}>
                <View style={styles.vectorMailOutline}>
                  <View style={styles.vectorMailFlap} />
                </View>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="sarah@company.io"
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

          {/* Organization / Company */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Organization / Company</Text>
            <View
              style={[
                styles.inputWrapper,
                isFocusedOrg && styles.inputWrapperFocused,
              ]}
            >
              {/* Office Building Glyph */}
              <View style={styles.inputIconBox}>
                <View style={styles.vectorBuildingOutline}>
                  <View style={styles.vectorWindowDot} />
                  <View style={styles.vectorWindowDot} />
                </View>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Apex Dynamics or Team Name"
                placeholderTextColor="#94A3B8"
                value={organization}
                onChangeText={text => {
                  setOrganization(text);
                  if (errorMessage) {
                    setErrorMessage('');
                  }
                }}
                autoCapitalize="words"
                onFocus={() => setIsFocusedOrg(true)}
                onBlur={() => setIsFocusedOrg(false)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                isFocusedPassword && styles.inputWrapperFocused,
              ]}
            >
              {/* Lock Glyph */}
              <View style={styles.inputIconBox}>
                <View style={styles.vectorLockShackle} />
                <View style={styles.vectorLockBody} />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="At least 6 characters"
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

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.strengthSection}>
                <View style={styles.strengthBarsRow}>
                  <View
                    style={[
                      styles.strengthBar,
                      passwordStrength.score >= 1 && {
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.strengthBar,
                      passwordStrength.score >= 2 && {
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.strengthBar,
                      passwordStrength.score >= 3 && {
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.strengthLabelText,
                    { color: passwordStrength.color },
                  ]}
                >
                  {passwordStrength.label}
                </Text>
              </View>
            )}
          </View>

          {/* Terms & Privacy Agreement */}
          <TouchableOpacity
            style={styles.termsRow}
            activeOpacity={0.8}
            onPress={() => setAgreedToTerms(prev => !prev)}
          >
            <View
              style={[
                styles.customCheckbox,
                agreedToTerms && styles.customCheckboxActive,
              ]}
            >
              {agreedToTerms && <Text style={styles.checkmarkGlyph}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsHighlight}>Terms of Service</Text> and{' '}
              <Text style={styles.termsHighlight}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* Primary Create Account Button */}
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            activeOpacity={0.85}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>
                Create Workspace Account
              </Text>
            )}
          </TouchableOpacity>

          {/* 1-Tap Demo Registration Pill */}
          <TouchableOpacity
            style={styles.demoFillPill}
            activeOpacity={0.8}
            onPress={fillDemoRegistration}
          >
            <View style={styles.demoDot} />
            <Text style={styles.demoFillText}>
              1-Tap Fill Registration Data
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Link to Login */}
        <View style={styles.footerRow}>
          <Text style={styles.footerPromptText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.footerActionText}>Sign In</Text>
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
    marginBottom: 24,
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
  headerSection: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  headerSubtitle: {
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
    gap: 16,
    marginBottom: 24,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
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
  // Vector User Glyph
  vectorUserCircle: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#64748B',
    marginBottom: 1,
  },
  vectorUserArch: {
    width: 12,
    height: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#64748B',
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
  // Vector Building Glyph
  vectorBuildingOutline: {
    width: 13,
    height: 14,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  vectorWindowDot: {
    width: 3,
    height: 2,
    backgroundColor: '#64748B',
    borderRadius: 0.5,
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
  // Password Strength
  strengthSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 4,
    width: 120,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#E2E8F0',
  },
  strengthLabelText: {
    fontSize: 11,
    fontWeight: '700',
  },
  // Terms
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
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
  termsText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
    lineHeight: 16,
  },
  termsHighlight: {
    color: '#4F46E5',
    fontWeight: '700',
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
    marginTop: 6,
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
