import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { UberColors } from "../../styles/uberTheme";
import styles from "../../styles/DasboardScreen.styles";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export default function EventosNotificaciones({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escucha en tiempo real la colección 'eventos'
    const unsub = onSnapshot(collection(db, "notificaciones"), (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Ordena por fecha si existe; intenta usar 'fecha' o 'fechaEvento'
      items.sort((a, b) => {
        const getDate = (x) => {
          const f = x.fecha || x.fechaEvento || x.date;
          if (!f) return 0;
          if (typeof f?.toDate === "function") return f.toDate().getTime();
          return new Date(f).getTime();
        };
        return getDate(a) - getDate(b);
      });
      setEvents(items);
      setLoading(false);
    }, (err) => {
      console.error("Error al escuchar eventos:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const formatDate = (f) => {
    if (!f) return "";
    const d = typeof f?.toDate === "function" ? f.toDate() : new Date(f);
    try {
      return d.toLocaleDateString();
    } catch {
      return String(d);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Eventos y Notificaciones</Text>

      <View style={styles.listContainer}>
        {loading ? (
          <Text style={{ color: UberColors.textSecondary }}>Cargando eventos...</Text>
        ) : events.length === 0 ? (
          <Text style={{ color: UberColors.textSecondary }}>No hay eventos próximos.</Text>
        ) : (
          events.map((ev, idx) => (
            <View key={ev.id}>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => navigation.navigate("NotificationsScreen", { eventId: ev.id })}
              >
                <View style={styles.listIcon}>
                  <FontAwesome
                    name={ev.icono || "calendar"}
                    size={18}
                    color={UberColors.textPrimary}
                  />
                </View>
                <View style={styles.listContent}>
                  <Text style={styles.listTitle}>{ev.titulo || ev.nombre || "Evento"}</Text>
                  <Text style={styles.listSubtitle}>{formatDate(ev.fecha || ev.fechaEvento || ev.date)}</Text>
                </View>
              </TouchableOpacity>
              {idx < events.length - 1 && <View style={styles.separator} />}
            </View>
          ))
        )}
      </View>
    </View>
  );
}
