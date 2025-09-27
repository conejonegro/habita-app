import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Switch, TouchableOpacity, Alert } from 'react-native';
import { UberColors, UberTypography, UberSpacing, UberShadows, UberBorderRadius } from '../styles/uberTheme';
import tempStore from '../utils/tempStore';
import storage from '../utils/storage';

export default function PaymentSetupScreen({ navigation }) {
  const [cardNumber, setCardNumber] = useState('');
  const [autoPay, setAutoPay] = useState(false);
  const [error, setError] = useState('');
  const [hasPaymentMethod, setHasPaymentMethod] = useState(!!tempStore.getItem('paymentMethod'));

  useEffect(() => {
    // Hydrate from storage on mount
    (async () => {
      const saved = await storage.getItem('paymentMethod');
      if (saved) {
        tempStore.setItem('paymentMethod', saved);
        setHasPaymentMethod(true);
      }
    })();
    const unsub = tempStore.subscribe((key) => {
      if (key === 'paymentMethod') {
        setHasPaymentMethod(!!tempStore.getItem('paymentMethod'));
      }
    });
    return () => unsub();
  }, []);

  const formatCardInput = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, 16);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join('-');
  };

  const onChangeCard = (text) => {
    setError('');
    setCardNumber(formatCardInput(text));
  };

  const onSave = async () => {
    const valid = /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(cardNumber);
    if (!valid) {
      setError('Formato inválido. Usa 0000-0000-0000-0000');
      return;
    }
    const last4 = cardNumber.slice(-4);
    const payload = { masked: cardNumber, last4, autoPay, createdAt: Date.now() };
    tempStore.setItem('paymentMethod', payload);
    await storage.setItem('paymentMethod', payload);
    Alert.alert('Guardado', 'Tu método de pago se guardó correctamente.', [
      { text: 'OK' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Configura tu método de pago para habilitar pagos automáticos y simplificar tus cobros mensuales.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Número de tarjeta</Text>
          <TextInput
            value={cardNumber}
            onChangeText={onChangeCard}
            placeholder="4145-4125-7854-7854"
            keyboardType="number-pad"
            style={styles.input}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Activar pagos automáticos</Text>
            <Switch value={autoPay} onValueChange={setAutoPay} />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={onSave}>
            <Text style={styles.buttonText}>Guardar configuración</Text>
          </TouchableOpacity>
        </View>

        {hasPaymentMethod && (
          <View style={[styles.card, { marginTop: UberSpacing.md }]}> 
            <Text style={styles.successTitle}>Método de pago activo</Text>
            <Text style={styles.successText}>Ya puedes pagar tu mensualidad.</Text>
            <TouchableOpacity
              style={[styles.button, { marginTop: UberSpacing.md }]}
              onPress={() => navigation?.navigate?.('Pagos', { screen: 'PaymentsHome' })}
            >
              <Text style={styles.buttonText}>Pagar mensualidad</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UberColors.backgroundSecondary,
  },
  scrollView: { flex: 1 },
  content: { padding: UberSpacing.lg },
  subtitle: {
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary,
    marginBottom: UberSpacing.lg,
  },
  card: {
    backgroundColor: UberColors.white,
    borderRadius: UberBorderRadius.lg,
    padding: UberSpacing.lg,
    ...UberShadows.small,
  },
  label: {
    fontSize: UberTypography.fontSize.sm,
    fontFamily: UberTypography.fontFamilySemiBold,
    color: UberColors.textSecondary,
    marginBottom: UberSpacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: UberColors.borderLight,
    borderRadius: UberBorderRadius.md,
    paddingHorizontal: UberSpacing.md,
    paddingVertical: 12,
    fontSize: UberTypography.fontSize.base,
    color: UberColors.textPrimary,
    marginBottom: UberSpacing.lg,
    backgroundColor: UberColors.white,
  },
  error: {
    color: '#B00020',
    marginBottom: UberSpacing.md,
    fontSize: UberTypography.fontSize.sm,
    fontFamily: UberTypography.fontFamily,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: UberSpacing.lg,
  },
  switchLabel: {
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textPrimary,
  },
  button: {
    backgroundColor: UberColors.buttonPrimary,
    borderRadius: UberBorderRadius['3xl'],
    paddingVertical: UberSpacing.md,
    paddingHorizontal: UberSpacing.lg,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: UberColors.buttonText,
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamilySemiBold,
  },
  successTitle: {
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamilySemiBold,
    color: UberColors.textPrimary,
    marginBottom: UberSpacing.xs,
  },
  successText: {
    fontSize: UberTypography.fontSize.sm,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary,
  },
});
