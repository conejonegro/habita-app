import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/firebaseConfig';
import { db } from '../firebase/firebaseConfig'; // Asegúrate de exportar `db` desde tu configuración de Firebase

export default function DashboardScreen({ navigation }) {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [userName, setUserName] = useState('');
  const [showPayButton, setShowPayButton] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

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

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [fadeAnim, events.length]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeMessage}>
        Hola <Text style={styles.userName}>{userName}</Text>, Bienvenido
      </Text>

      {/* Estado de pagos */}
      <View style={[styles.card, paymentStatus === 'Al día' ? { backgroundColor: '#d4f7d4' } : { backgroundColor: '#f7d4d4' }]}>
        <Text style={styles.cardTitle}>Estado de pagos</Text>
        <Text style={[styles.status, paymentStatus === 'Al día' ? { color: 'green' } : { color: 'red' }]}>        
          {paymentStatus === 'Al día' ? '✅ ' : '❌ '}
          {paymentStatus || 'Cargando...'}
        </Text>
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

      {/* Próximos eventos */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>        
        <Text style={styles.cardTitle}>Próximos eventos</Text>
        <Text>📅 {events[currentEventIndex].title}</Text>
        <Text style={styles.date}>{events[currentEventIndex].date}</Text>
      </Animated.View>

      {/* Notificaciones */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('NotificationsScreen')}>
        <Text style={styles.cardTitle}>Notificaciones</Text>
        <Text>🚰 Corte de agua</Text>
        <Text style={styles.date}>Mañana a las 10:00 AM</Text>
      </TouchableOpacity>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  greeting: { fontSize: 18, marginBottom: 20 },
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f7f7f7',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  status: { fontSize: 18, fontWeight: 'bold' },
  date: { fontSize: 13, color: '#555', marginTop: 5 },
  welcomeMessage: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },
  userName: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventContainer: {
    // transition: 'transform 0.5s ease-in-out',
  },
});
