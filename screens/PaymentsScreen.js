import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { UberColors, UberTypography, UberSpacing, UberShadows, UberBorderRadius } from '../styles/uberTheme';

export default function PaymentsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pagos</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>Gestiona tus pagos y facturas</Text>
          
          {/* Payment Cards */}
          <View style={styles.paymentCard}>
            <Text style={styles.cardTitle}>Pago Mensual</Text>
            <Text style={styles.amount}>$2,500.00 MXN</Text>
            <Text style={styles.dueDate}>Vence el 15 de cada mes</Text>
            <View style={styles.paymentButton}>
              <Text style={styles.paymentButtonText}>Pagar Ahora</Text>
            </View>
          </View>
          
          <View style={styles.paymentCard}>
            <Text style={styles.cardTitle}>Mantenimiento</Text>
            <Text style={styles.amount}>$500.00 MXN</Text>
            <Text style={styles.dueDate}>Pendiente de pago</Text>
            <View style={styles.paymentButton}>
              <Text style={styles.paymentButtonText}>Pagar Ahora</Text>
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
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary,
    marginBottom: UberSpacing.xl,
  },
  paymentCard: {
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
  amount: {
    fontSize: UberTypography.fontSize['3xl'],
    fontFamily: UberTypography.fontFamilyBold,
    color: UberColors.textPrimary,
    marginBottom: UberSpacing.xs,
  },
  dueDate: {
    fontSize: UberTypography.fontSize.sm,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary,
    marginBottom: UberSpacing.lg,
  },
  paymentButton: {
    backgroundColor: UberColors.buttonPrimary,
    borderRadius: UberBorderRadius['3xl'],
    paddingVertical: UberSpacing.md,
    paddingHorizontal: UberSpacing.lg,
    alignSelf: 'flex-start',
  },
  paymentButtonText: {
    color: UberColors.buttonText,
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamilySemiBold,
  },
});
