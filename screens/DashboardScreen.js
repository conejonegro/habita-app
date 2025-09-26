import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { UberColors } from "../styles/uberTheme";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig"; // Asegúrate de exportar `db` desde tu configuración de Firebase
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/DasboardScreen.styles";
import Mantenimiento from "../components/Mantenimiento";

export default function DashboardScreen({ navigation }) {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [userName, setUserName] = useState("");
  const [showPayButton, setShowPayButton] = useState(false);
  const [nextPaymentWindow, setNextPaymentWindow] = useState("");

  const events = [
    { title: "Junta de condominio", date: "Lun, 14 de Oct" },
    { title: "Corte de agua", date: "Mañana a las 10:00 AM" },
    { title: "Mantenimiento general", date: "Vie, 20 de Oct" },
  ];

  useEffect(() => {
    const checkPaymentAvailability = (dueDate) => {
      const today = new Date();
      const due = dueDate.toDate(); // Convertir el timestamp a Date

      if (today.getDate() >= 17 && today) {
        setShowPayButton(true);
      } else {
        setShowPayButton(false);
      }
    };

    const computeNextPaymentWindow = () => {
      const today = new Date();
      // Calcular el próximo mes
      const nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const monthsEs = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];
      const monthName = monthsEs[nextMonthDate.getMonth()];
      const year = nextMonthDate.getFullYear();
      return `del 1 al 10 de ${monthName} ${year}`;
    };

    const fetchPaymentStatus = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "payments", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const today = new Date();
            const currentMonth = `${
              today.getMonth() + 1
            }-${today.getFullYear()}`; // Formato MM-YYYY

            if (data.isPaid) {
              setPaymentStatus("Al día");
            } else {
              setPaymentStatus(
                `Pago pendiente. Fecha límite: ${data.dueDate
                  .toDate()
                  .toLocaleDateString()}`
              );
            }
            checkPaymentAvailability(data.dueDate);
          } else {
            setPaymentStatus("No se encontró información de pagos");
          }
        }
      } catch (error) {
        console.error("Error al obtener el estado de pagos:", error);
        setPaymentStatus("Error al obtener información");
      }
    };

    const fetchUserName = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const formattedName = user.displayName
            ? user.displayName
                .split(" ")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")
            : "Usuario";
          setUserName(formattedName);
        }
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
      }
    };

    fetchPaymentStatus();
    fetchUserName();
    setNextPaymentWindow(computeNextPaymentWindow());
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inicio</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcomeMessage}>
          Hola <Text style={styles.userName}>{userName}</Text>, Bienvenido
        </Text>

        {/* Status de pago */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estado de pago</Text>
          <View
            style={[
              styles.paymentStatusBadge,
              paymentStatus === "Al día"
                ? styles.statusPaid
                : styles.statusPending,
            ]}
          >
            <Text
              style={[
                styles.paymentStatusText,
                paymentStatus === "Al día"
                  ? styles.statusPaidText
                  : styles.statusPendingText,
              ]}
            >
              {paymentStatus}
            </Text>
          </View>
          {nextPaymentWindow ? (
            <Text style={[styles.status, { marginTop: 8 }]}>
              Próximo pago: {nextPaymentWindow}
            </Text>
          ) : null}
        </View>

        {/* Actualiza tu Método de Pago */}
        <View style={[styles.card, { backgroundColor: "#E3F2FD" }]}>
          <Text style={styles.cardTitle}>Actualiza tu Método de Pago</Text>
          <View style={styles.paymentMessageContainer}>
            <FontAwesome
              name="credit-card"
              size={16}
              color="#1976D2"
              style={styles.paymentIcon}
            />
            <Text style={[styles.status, { color: "#1976D2" }]}>
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
              onPress={() => navigation.navigate("Pagos")} // Cambiado de 'PaymentScreen' a 'Pagos'
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
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation.navigate("NotificationsScreen")}
            >
              <View style={styles.listIcon}>
                <FontAwesome
                  name="calendar"
                  size={18}
                  color={UberColors.textPrimary}
                />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listTitle}>Junta de condominio</Text>
                <Text style={styles.listSubtitle}>Lun, 14 de Oct</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation.navigate("NotificationsScreen")}
            >
              <View style={styles.listIcon}>
                <FontAwesome
                  name="tint"
                  size={18}
                  color={UberColors.textPrimary}
                />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listTitle}>Corte de agua</Text>
                <Text style={styles.listSubtitle}>Mañana a las 10:00 AM</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation.navigate("NotificationsScreen")}
            >
              <View style={styles.listIcon}>
                <FontAwesome
                  name="wrench"
                  size={18}
                  color={UberColors.textPrimary}
                />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listTitle}>Mantenimiento general</Text>
                <Text style={styles.listSubtitle}>Vie, 20 de Oct</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Crear Ticket de Mantenimiento */}
        <Mantenimiento navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
}
