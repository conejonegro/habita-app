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
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../../styles/DasboardScreen.styles";

export default function Mantenimiento({ navigation }) {

  const [userName, setUserName] = useState("");

  const [tickets, setTickets] = useState([]); // 👈 guardar tickets del usuario

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

    const fetchTickets = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(
            collection(db, "tickets_mantenimiento"),
            where("userId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          const userTickets = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((t) => (t.status || '').toLowerCase() !== 'cerrado');
          setTickets(userTickets);
        }
      } catch (error) {
        console.error("Error al obtener tickets:", error);
      }
    };

    fetchTickets();
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
                    {ticket.status || "abierto"} ·{" "}
                    {ticket.fechaCreacion
                      ? new Date(ticket.fechaCreacion.seconds * 1000).toLocaleDateString()
                      : "sin fecha"}
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
