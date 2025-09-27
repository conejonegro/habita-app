import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import styles from "../../styles/DasboardScreen.styles";
import tempStore from "../../utils/tempStore";
import storage from "../../utils/storage";

export default function PagosSection({ navigation }) {
  const [paymentStatus, setPaymentStatus] = useState("Cargando...");
  const [nextPaymentWindow, setNextPaymentWindow] = useState("");
  const [showPayButton, setShowPayButton] = useState(false);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  useEffect(() => {
    const checkPaymentAvailability = (dueDate) => {
      const today = new Date();
      if (today.getDate() >= 17) {
        setShowPayButton(true);
      } else {
        setShowPayButton(false);
      }
    };

    const computeNextPaymentWindow = () => {
      const today = new Date();
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
        } else {
          setPaymentStatus("No autenticado");
        }
      } catch (error) {
        console.error("Error al obtener el estado de pagos:", error);
        setPaymentStatus("Error al obtener información");
      }
    };

    const checkPaymentMethod = async () => {
      let pm = tempStore.getItem("paymentMethod");
      if (!pm) {
        pm = await storage.getItem('paymentMethod');
        if (pm) tempStore.setItem('paymentMethod', pm);
      }
      setHasPaymentMethod(!!pm);
    };

    setNextPaymentWindow(computeNextPaymentWindow());
    fetchPaymentStatus();
    checkPaymentMethod();

    const unsubscribe = tempStore.subscribe((key) => {
      if (key === "paymentMethod") checkPaymentMethod();
    });

    const focusUnsub = navigation?.addListener?.('focus', checkPaymentMethod);

    return () => {
      unsubscribe?.();
      focusUnsub?.();
    };
  }, []);

  const isPaid = paymentStatus === "Al día";

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estado de pago</Text>
        <View
          style={[
            styles.paymentStatusBadge,
            isPaid ? styles.statusPaid : styles.statusPending,
          ]}
        >
          <Text
            style={[
              styles.paymentStatusText,
              isPaid ? styles.statusPaidText : styles.statusPendingText,
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

      {!hasPaymentMethod && (
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
          <TouchableOpacity
            style={[styles.button, { marginTop: 12 }]}
            onPress={() => navigation?.navigate?.('Pagos', { screen: 'PaymentSetup' })}
          >
            <Text style={styles.buttonText}>Configurar Pago</Text>
          </TouchableOpacity>
        </View>
      )}

      {hasPaymentMethod && (
        <View style={[styles.card, { backgroundColor: "#E8F5E9" }]}>
          <Text style={styles.cardTitle}>Pagos</Text>
          <View style={styles.paymentMessageContainer}>
            <FontAwesome
              name="check-circle"
              size={16}
              color="#2E7D32"
              style={styles.paymentIcon}
            />
            <Text style={[styles.status, { color: "#2E7D32" }]}>
              Método de pago activo. Puedes pagar tu mensualidad.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.button, { marginTop: 12 }]}
            onPress={() => navigation?.navigate?.('Pagos', { screen: 'PaymentsHome' })}
          >
            <Text style={styles.buttonText}>Pagar mensualidad</Text>
          </TouchableOpacity>
        </View>
      )}

      {showPayButton && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Realizar Pago</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation?.navigate?.("Pagos")}
          >
            <Text style={styles.buttonText}>Ir a Pagar</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
