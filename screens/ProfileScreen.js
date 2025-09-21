import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { UberColors, UberTypography, UberSpacing, UberShadows, UberBorderRadius } from '../styles/uberTheme';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function ProfileScreen({ navigation }) {
  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              // La navegación se manejará automáticamente por el onAuthStateChanged en App.js
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar sesión. Inténtalo de nuevo.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>Gestiona tu cuenta y configuración</Text>
          
          {/* Profile Info */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>U</Text>
              </View>
            </View>
            <Text style={styles.userName}>Usuario</Text>
            <Text style={styles.userEmail}>usuario@ejemplo.com</Text>
          </View>
          
          {/* Profile Options */}
          <View style={styles.optionCard}>
            <Text style={styles.cardTitle}>Configuración</Text>
            <View style={styles.optionItem}>
              <Text style={styles.optionText}>Editar Perfil</Text>
              <Text style={styles.optionArrow}>›</Text>
            </View>
            <View style={styles.optionItem}>
              <Text style={styles.optionText}>Notificaciones</Text>
              <Text style={styles.optionArrow}>›</Text>
            </View>
            <View style={styles.optionItem}>
              <Text style={styles.optionText}>Privacidad</Text>
              <Text style={styles.optionArrow}>›</Text>
            </View>
          </View>
          
          <View style={styles.optionCard}>
            <Text style={styles.cardTitle}>Cuenta</Text>
            <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
              <Text style={[styles.optionText, styles.logoutText]}>Cerrar Sesión</Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UberColors.backgroundSecondary,
  },
  header: {
    backgroundColor: UberColors.backgroundSecondary,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: UberSpacing.lg,
  },
  headerTitle: {
    fontSize: UberTypography.fontSize['3xl'],
    fontWeight: '700',
    color: UberColors.textPrimary,
    textAlign: 'left',
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: UberSpacing.lg,
  },
  subtitle: {
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary,
    marginBottom: UberSpacing.xl,
    textAlign: 'left',
  },
  profileCard: {
    backgroundColor: UberColors.white,
    borderRadius: UberBorderRadius.lg,
    padding: UberSpacing.lg,
    marginBottom: UberSpacing.md,
    alignItems: 'center',
    ...UberShadows.small,
  },
  avatarContainer: {
    marginBottom: UberSpacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: UberColors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: UberTypography.fontSize['2xl'],
    fontFamily: UberTypography.fontFamilyBold,
    color: UberColors.white,
  },
  userName: {
    fontSize: UberTypography.fontSize.xl,
    fontFamily: UberTypography.fontFamilySemiBold,
    color: UberColors.textPrimary,
    marginBottom: UberSpacing.xs,
  },
  userEmail: {
    fontSize: UberTypography.fontSize.sm,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary,
  },
  optionCard: {
    backgroundColor: UberColors.white,
    borderRadius: UberBorderRadius.lg,
    padding: UberSpacing.lg,
    marginBottom: UberSpacing.md,
    ...UberShadows.small,
  },
  cardTitle: {
    fontSize: UberTypography.fontSize.xl,
    fontWeight: '700',
    color: UberColors.textPrimary,
    marginBottom: UberSpacing.md,
    letterSpacing: -0.3,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: UberSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: UberColors.borderLight,
  },
  optionText: {
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textPrimary,
  },
  optionArrow: {
    fontSize: UberTypography.fontSize.lg,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary,
  },
  logoutText: {
    color: UberColors.red,
    fontFamily: UberTypography.fontFamilySemiBold,
  },
});
