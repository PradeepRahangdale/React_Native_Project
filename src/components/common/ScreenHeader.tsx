import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants';
import { useNavigation } from '../../navigation';

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showHome?: boolean;
  backLabel?: string;
  rightAction?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  showHome = true,
  backLabel = 'Back',
  rightAction,
}) => {
  const { goBack, goHome, canGoBack } = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        {showBack && canGoBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.chevronBox}>
              <Text style={styles.chevronIcon}>‹</Text>
            </View>
            {backLabel ? <Text style={styles.backText}>{backLabel}</Text> : null}
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyNav} />
        )}

        <View style={styles.rightGroup}>
          {rightAction}
          {showHome && (
            <TouchableOpacity
              style={styles.homeButton}
              onPress={goHome}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.homeIcon}>🏠</Text>
              <Text style={styles.homeText}>Home</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {title && (
        <View style={styles.titleBox}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingLeft: 8,
    paddingRight: 14,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  chevronBox: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  chevronIcon: {
    fontSize: 26,
    lineHeight: 26,
    color: colors.primary,
    fontWeight: '700',
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: -3,
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    includeFontPadding: false,
  },
  emptyNav: {
    height: 38,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  homeIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  homeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    includeFontPadding: false,
  },
  titleBox: {
    marginTop: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
});
