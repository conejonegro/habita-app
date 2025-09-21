import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { UberColors, UberTypography, UberSpacing, UberShadows, UberBorderRadius } from '../styles/uberTheme';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/firebaseConfig';
import { db } from '../firebase/firebaseConfig'; // Asegúrate de exportar `db` desde tu configuración de Firebase
import { FontAwesome } from '@expo/vector-icons';

export default function DashboardScreen({ navigation }) {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [userName, setUserName] = useState('');
  const [showPayButton, setShowPayButton] = useState(false);

  const events = [
    { title: 'Junta de condominio', date: 'Lun, 14 de Oct' },
    { title: 'Corte de agua', date: 'Mañana a las 10:00 AM' },
    { title: 'Mantenimiento general', date: 'Vie, 20 de Oct' },
  ];

  useEffect(() => {
    const checkPaymentAvailability = (dueDate) => {
      const today = new Date();
      const due = dueDate.toDate(); // Convertir el timestamp a Date

      if (today.getDate() >= 17 && today >= due) {
        setShowPayButton(true);
      } else {
        setShowPayButton(false);
      }
    };

    const fetchPaymentStatus = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'payments', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const today = new Date();
            const currentMonth = `${today.getMonth() + 1}-${today.getFullYear()}`; // Formato MM-YYYY

            if (data.isPaid) {
              setPaymentStatus('Al día');
            } else {
              setPaymentStatus(`Pago pendiente. Fecha límite: ${data.dueDate.toDate().toLocaleDateString()}`);
            }
            checkPaymentAvailability(data.dueDate);
          } else {
            setPaymentStatus('No se encontró información de pagos');
          }
        }
      } catch (error) {
        console.error('Error al obtener el estado de pagos:', error);
        setPaymentStatus('Error al obtener información');
      }
    };

    const fetchUserName = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const formattedName = user.displayName
            ? user.displayName
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
            : 'Usuario';
          setUserName(formattedName);
        }
      } catch (error) {
        console.error('Error al obtener el nombre del usuario:', error);
      }
    };

    fetchPaymentStatus();
    fetchUserName();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inicio</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcomeMessage}>
          Hola <Text style={styles.userName}>{userName}</Text>, Bienvenido
        </Text>

      {/* Actualiza tu Método de Pago */}
      <View style={[styles.card, { backgroundColor: '#E3F2FD' }]}>
        <Text style={styles.cardTitle}>Actualiza tu Método de Pago</Text>
        <View style={styles.paymentMessageContainer}>
          <FontAwesome name="credit-card" size={16} color="#1976D2" style={styles.paymentIcon} />
          <Text style={[styles.status, { color: '#1976D2' }]}>        
            Agrega un método de pago y activa pagos automáticos fácilmente
          </Text>
        </View>
        <TouchableOpacity style={[styles.button, { marginTop: 12 }]}>
          <Text style={styles.buttonText}>Configurar Pago</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de Pago */}
      {showPayButton && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Realizar Pago</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('PaymentScreen')}
          >
            <Text style={styles.buttonText}>Ir a Pagar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Eventos y Notificaciones */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Eventos y Notificaciones</Text>
        
        {/* Lista de eventos y notificaciones */}
        <View style={styles.listContainer}>
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('NotificationsScreen')}>
            <View style={styles.listIcon}>
              <FontAwesome name="calendar" size={18} color={UberColors.textPrimary} />
            </View>
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Junta de condominio</Text>
              <Text style={styles.listSubtitle}>Lun, 14 de Oct</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('NotificationsScreen')}>
            <View style={styles.listIcon}>
              <FontAwesome name="tint" size={18} color={UberColors.textPrimary} />
            </View>
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Corte de agua</Text>
              <Text style={styles.listSubtitle}>Mañana a las 10:00 AM</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('NotificationsScreen')}>
            <View style={styles.listIcon}>
              <FontAwesome name="wrench" size={18} color={UberColors.textPrimary} />
            </View>
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Mantenimiento general</Text>
              <Text style={styles.listSubtitle}>Vie, 20 de Oct</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Crear Ticket de Mantenimiento */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Crear Ticket de Mantenimiento</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MaintenanceTicketScreen')}
        >
          <Text style={styles.buttonText}>Ir a Crear Ticket</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: UberColors.backgroundSecondary 
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
  welcomeMessage: {
    fontSize: UberTypography.fontSize.xl,
    fontFamily: UberTypography.fontFamilyMedium,
    color: UberColors.textPrimary,
    marginBottom: UberSpacing.lg,
    marginHorizontal: UberSpacing.lg,
    marginTop: UberSpacing.lg,
  },
  userName: {
    fontFamily: UberTypography.fontFamilyBold,
    color: UberColors.primaryBlue,
  },
  card: {
    padding: UberSpacing.lg,
    borderRadius: UberBorderRadius.lg,
    backgroundColor: UberColors.white,
    marginBottom: UberSpacing.md,
    marginHorizontal: UberSpacing.lg,
    ...UberShadows.small,
  },
  cardTitle: { 
    fontSize: UberTypography.fontSize.xl, 
    fontWeight: '700',
    marginBottom: UberSpacing.sm,
    color: UberColors.textPrimary,
    letterSpacing: -0.3,
  },
  status: { 
    fontSize: UberTypography.fontSize.lg, 
    fontFamily: UberTypography.fontFamilySemiBold,
    color: UberColors.textPrimary,
  },
  date: { 
    fontSize: UberTypography.fontSize.sm, 
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary, 
    marginTop: UberSpacing.sm 
  },
  button: {
    marginTop: UberSpacing.md,
    paddingVertical: UberSpacing.md,
    paddingHorizontal: UberSpacing.lg,
    borderRadius: UberBorderRadius['3xl'],
    backgroundColor: UberColors.buttonPrimary,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: UberColors.buttonText,
    fontFamily: UberTypography.fontFamilySemiBold,
    fontSize: UberTypography.fontSize.base,
  },
  eventContainer: {
    // transition: 'transform 0.5s ease-in-out',
  },
  listContainer: {
    marginTop: UberSpacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: UberSpacing.md,
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: UberColors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: UberSpacing.md,
  },
  paymentMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: UberSpacing.sm,
  },
  paymentIcon: {
    marginRight: UberSpacing.sm,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamilyBold,
    color: UberColors.textPrimary,
    marginBottom: 2,
  },
  listSubtitle: {
    fontSize: UberTypography.fontSize.sm,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: UberColors.borderLight,
    marginLeft: 56, // 40 (icon width) + 16 (margin)
  },
});
