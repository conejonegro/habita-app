import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { UberColors, UberTypography, UberSpacing, UberShadows, UberBorderRadius } from '../styles/uberTheme';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, Timestamp } from 'firebase/firestore';
import { fetchUserProfile } from '../services/userService';
import { createPayment } from '../services/paymentsService';
import tempStore from '../utils/tempStore';
import storage from '../utils/storage';

export default function PaymentsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState('');
  const [hasPaymentMethod, setHasPaymentMethod] = useState(!!tempStore.getItem('paymentMethod'));

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          setError('No autenticado');
          return;
        }
        const p = await fetchUserProfile(user.uid);
        if (mounted) setPerfil(p);
        // hydrate payment method from storage if needed
        const saved = await storage.getItem('paymentMethod');
        if (saved) tempStore.setItem('paymentMethod', saved);
      } catch (e) {
        console.error(e);
        if (mounted) setError('Error cargando perfil');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    const unsub = tempStore.subscribe((key) => {
      if (key === 'paymentMethod') setHasPaymentMethod(!!tempStore.getItem('paymentMethod'));
    });
    return () => { mounted = false; unsub(); };
  }, []);

  const computeNextDueDate = useCallback(() => {
    const today = new Date();
    const targetDay = 15;
    const due = new Date(today.getFullYear(), today.getMonth(), targetDay);
    if (today > due) {
      return new Date(today.getFullYear(), today.getMonth() + 1, targetDay);
    }
    return due;
  }, []);

  const onPayNow = useCallback(() => {
    if (!auth.currentUser) {
      console.log('[Payments] Usuario no autenticado');
      // Mostrar alerta con fallback web
      if (Platform.OS === 'web') {
        window.alert('No autenticado. Inicia sesión para continuar.');
      } else {
        Alert.alert('No autenticado', 'Inicia sesión para continuar.');
      }
      return;
    }
    if (!hasPaymentMethod) {
      console.log('[Payments] Falta método de pago');
      if (Platform.OS === 'web') {
        window.alert('Configura un método de pago antes de pagar.');
      } else {
        Alert.alert('Método de pago', 'Configura un método de pago antes de pagar.');
      }
      return;
    }

    const confirm = () => new Promise((resolve) => {
      if (Platform.OS === 'web') {
        const ok = window.confirm('¿Deseas registrar el pago ahora?');
        resolve(ok);
      } else {
        Alert.alert('Confirmar pago', '¿Deseas registrar el pago ahora?', [
          { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Pagar', style: 'default', onPress: () => resolve(true) },
        ]);
      }
    });

    (async () => {
      console.log('[Payments] Iniciando confirmación de pago');
      const ok = await confirm();
      if (!ok) { console.log('[Payments] Pago cancelado por el usuario'); return; }
      try {
        const user = auth.currentUser;
        console.log('[Payments] UID', user?.uid);

        // Datos reales del usuario/perfil
        const rawAmount = typeof perfil?.cuotaMensual === 'number' ? perfil.cuotaMensual : Number(perfil?.cuotaMensual);
        if (!rawAmount || Number.isNaN(rawAmount)) {
          const msg = 'No se encontró un monto válido (cuotaMensual) en tu perfil.';
          console.log('[Payments] ' + msg, perfil?.cuotaMensual);
          if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Cuota inválida', msg);
          return;
        }
        const amount = Math.round(rawAmount);

        // dueDate: 15 del mes según helper existente
        const dueDate = Timestamp.fromDate(computeNextDueDate());

        // lastPaymentDate: ahora
        const lastPaymentDate = Timestamp.fromDate(new Date());

        // edificioRef: aceptar referencia o path string
        let edificioRef = perfil?.edificioRef || null;
        if (typeof edificioRef === 'string') {
          const path = edificioRef.replace(/^\//, ''); // quitar slash inicial si lo hay
          const parts = path.split('/');
          if (parts.length >= 2) {
            edificioRef = doc(db, parts[0], parts[1]);
          } else {
            console.log('[Payments] edificioRef string inesperado:', edificioRef);
            edificioRef = null;
          }
        }

        const email = user?.email || '';
        const isPaid = true;
        const notes = 'Pago realizado desde la app';
        const paymentMethod = tempStore.getItem('paymentMethod') || 'tarjeta';
        const unidadId = perfil?.unidadId || perfil?.depaId || '';
        const userId = user.uid; // ID del documento = UID de Google

        console.log('[Payments] Creando documento en payments con ID', userId, {
          amount, dueDate: 'ts', unidadId, email, paymentMethod,
        });
        await createPayment({
          id: userId,
          amount,
          dueDate,
          edificioRef,
          email,
          isPaid,
          lastPaymentDate,
          notes,
          paymentMethod,
          unidadId,
          userId,
        });
        const successMsg = `Pago exitoso. Registrado $${amount.toLocaleString()} MXN`;
        if (Platform.OS === 'web') {
          window.alert(successMsg);
        } else {
          Alert.alert('Pago exitoso', successMsg);
        }
      } catch (e) {
        console.error('Error creando pago', e);
        if (Platform.OS === 'web') {
          window.alert('Error: No se pudo registrar el pago.');
        } else {
          Alert.alert('Error', 'No se pudo registrar el pago.');
        }
      }
    })();
  }, [hasPaymentMethod]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { alignItems: 'center', justifyContent: 'center' }]}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pagos</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>Gestiona tus pagos y facturas</Text>
          {!hasPaymentMethod && (
            <View style={[styles.paymentCard, { backgroundColor: '#E3F2FD' }]}> 
              <Text style={styles.cardTitle}>Configura tu método de pago</Text>
              <Text style={styles.dueDate}>Antes de pagar, agrega una tarjeta.</Text>
              <TouchableOpacity
                style={styles.paymentButton}
                onPress={() => navigation?.navigate?.('PaymentSetup')}
              >
                <Text style={styles.paymentButtonText}>Configurar Pago</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Payment Cards */}
          <View style={styles.paymentCard}>
            <Text style={styles.cardTitle}>Pago Mensual</Text>
            <Text style={styles.amount}>
              ${ typeof perfil?.cuotaMensual === 'number' ? perfil.cuotaMensual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : String(perfil?.cuotaMensual || '0') } MXN
            </Text>
            <Text style={styles.dueDate}>Vence el 15 de cada mes</Text>
            <TouchableOpacity
              style={styles.paymentButton}
              onPress={() => { console.log('onPayNow pressed'); onPayNow(); }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.8}
            >
              <Text style={styles.paymentButtonText}>Pagar Ahora</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.paymentCard}>
            <Text style={styles.cardTitle}>Mantenimiento</Text>
            <Text style={styles.amount}>$500.00 MXN</Text>
            <Text style={styles.dueDate}>Pendiente de pago</Text>
            <TouchableOpacity style={styles.paymentButton} onPress={() => Alert.alert('Simulación', 'Implementar pago de mantenimiento')}>
              <Text style={styles.paymentButtonText}>Pagar Ahora</Text>
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
