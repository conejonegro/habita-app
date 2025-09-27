import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { UberColors } from "../../styles/uberTheme";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../../styles/DasboardScreen.styles";

export default function Mantenimiento({ navigation }) {

  const [userName, setUserName] = useState("");

  const [tickets, setTickets] = useState([]); // 👈 guardar tickets del usuario

  const formatFecha = (createdAt) => {
    try {
      if (!createdAt) return "sin fecha";
      if (typeof createdAt === "object" && typeof createdAt.seconds === "number") {
        return new Date(createdAt.seconds * 1000).toLocaleDateString();
      }
      if (createdAt && typeof createdAt.toDate === "function") {
        return createdAt.toDate().toLocaleDateString();
      }
      const d = new Date(createdAt);
      return Number.isFinite(d.getTime()) ? d.toLocaleDateString() : "sin fecha";
    } catch {
      return "sin fecha";
    }
  };

  useEffect(() => {
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

    // Suscripción en tiempo real a los tickets del usuario
    let unsubscribe;
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, "tickets_mantenimiento"),
          where("userId", "==", user.uid)
        );
        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const userTickets = snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .filter((t) => (t.status || "").toLowerCase() !== "cerrado");

            // Ordenar por fecha de creación (más reciente primero)
            const getCreationTimeMs = (ticket) => {
              const createdAt = ticket.fechaCreacion;
              if (!createdAt) return 0;
              if (
                typeof createdAt === "object" &&
                typeof createdAt.seconds === "number"
              ) {
                const nanoSeconds =
                  typeof createdAt.nanoseconds === "number"
                    ? createdAt.nanoseconds
                    : 0;
                return createdAt.seconds * 1000 + nanoSeconds / 1e6;
              }
              if (createdAt && typeof createdAt.toDate === "function") {
                try {
                  return createdAt.toDate().getTime();
                } catch {}
              }
              const parsedTime = new Date(createdAt).getTime();
              return Number.isFinite(parsedTime) ? parsedTime : 0;
            };

            userTickets.sort((a, b) => getCreationTimeMs(b) - getCreationTimeMs(a));

            setTickets(userTickets);
          },
          (error) => {
            console.error("Error al suscribirse a tickets:", error);
          }
        );
      }
    } catch (error) {
      console.error("Error configurando la suscripción de tickets:", error);
    }

    fetchUserName();

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
     
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
       

        {/* 🔧 Sección Tickets de Mantenimiento */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mis Tickets de Mantenimiento</Text>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                style={styles.listItem}
                onPress={() => navigation.navigate('TicketDetail', { ticketId: ticket.id })}
              >
                <View style={styles.listIcon}>
                  <FontAwesome
                    name="wrench"
                    size={18}
                    color={UberColors.textPrimary}
                  />
                </View>
                <View style={styles.listContent}>
                  <Text style={styles.listTitle}>{ticket.titulo}</Text>
                  <Text style={styles.listSubtitle}>
                    {ticket.status || "abierto"} · {formatFecha(ticket.fechaCreacion)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: UberColors.textSecondary }}>
              No has creado tickets todavía.
            </Text>
          )}

          <TouchableOpacity
            style={[styles.button, { marginTop: 12 }]}
            onPress={() => navigation.navigate("MaintenanceTicket")}
          >
            <Text style={styles.buttonText}>Crear Nuevo Ticket</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
