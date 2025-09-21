import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { UberColors, UberTypography, UberSpacing, UberShadows, UberBorderRadius } from '../styles/uberTheme';

export default function SupportScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Soporte</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>¿Necesitas ayuda? Estamos aquí para ti</Text>
          
          {/* Support Options */}
          <View style={styles.supportCard}>
            <Text style={styles.cardTitle}>Contacto Directo</Text>
            <Text style={styles.cardDescription}>Llámanos al 555-0123 o envía un WhatsApp</Text>
            <View style={styles.supportButton}>
              <Text style={styles.supportButtonText}>Contactar</Text>
            </View>
          </View>
          
          <View style={styles.supportCard}>
            <Text style={styles.cardTitle}>Preguntas Frecuentes</Text>
            <Text style={styles.cardDescription}>Encuentra respuestas a las preguntas más comunes</Text>
            <View style={styles.supportButton}>
              <Text style={styles.supportButtonText}>Ver FAQ</Text>
            </View>
          </View>
          
          <View style={styles.supportCard}>
            <Text style={styles.cardTitle}>Reportar Problema</Text>
            <Text style={styles.cardDescription}>Reporta problemas técnicos o de mantenimiento</Text>
            <View style={styles.supportButton}>
              <Text style={styles.supportButtonText}>Reportar</Text>
            </View>
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
    color: UberColors.textSecondary,
    marginBottom: UberSpacing.xl,
    textAlign: 'left',
  },
  supportCard: {
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
    marginBottom: UberSpacing.sm,
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: UberTypography.fontSize.sm,
    color: UberColors.textSecondary,
    marginBottom: UberSpacing.lg,
    lineHeight: UberTypography.lineHeight.relaxed * UberTypography.fontSize.sm,
  },
  supportButton: {
    backgroundColor: UberColors.buttonPrimary,
    borderRadius: UberBorderRadius['3xl'],
    paddingVertical: UberSpacing.md,
    paddingHorizontal: UberSpacing.lg,
    alignSelf: 'flex-start',
  },
  supportButtonText: {
    color: UberColors.buttonText,
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamilySemiBold,
  },
});
