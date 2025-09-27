import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { UberColors } from "../../styles/uberTheme";
import styles from "../../styles/DasboardScreen.styles";
import { collection, onSnapshot, query, where, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";

export default function EventosNotificaciones({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubA = null;
    let unsubB = null;
    let unsubT = [];
    let cancelled = false;

    let cacheA = [];
    let cacheB = [];
    let cacheT = [];

    const applyMerge = () => {
      const map = new Map();
      [...cacheA, ...cacheB, ...cacheT].forEach((it) => map.set(it.id, it));
      // Filtro insensible a mayúsculas por estado 'enviada'
      const items = Array.from(map.values()).filter((x) => {
        const est = (x.estado || "").toString().toLowerCase();
        return est === "enviada";
      });
      items.sort((a, b) => {
        const getDate = (x) => {
          const f = x.fecha || x.fechaEvento || x.date || x.createdAt;
          if (!f) return 0;
          if (typeof f?.toDate === "function") return f.toDate().getTime();
          return new Date(f).getTime();
        };
        return getDate(b) - getDate(a);
      });
      if (!cancelled) {
        setEvents(items);
        setLoading(false);
      }
    };

    async function load() {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          setEvents([]);
          setLoading(false);
          return;
        }
        const perfilRef = doc(db, "usuarios", user.uid);
        const perfilSnap = await getDoc(perfilRef);
        if (!perfilSnap.exists()) {
          setEvents([]);
          setLoading(false);
          return;
        }
        const perfil = perfilSnap.data();
        const edificioRef = perfil?.edificioRef || null;
        const torreUsuario = perfil?.torre || perfil?.torreCode || perfil?.torreId || null;

        const colRef = collection(db, "notificaciones");

        if (edificioRef) {
          unsubA = onSnapshot(query(colRef, where("edificioRef", "==", edificioRef)), (snap) => {
            cacheA = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            applyMerge();
          });
          const edificioId = edificioRef.id || null;
          if (edificioId) {
            unsubB = onSnapshot(query(colRef, where("edificioId", "==", edificioId)), (snap) => {
              cacheB = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
              applyMerge();
            });
          }
        }

        // Listeners por torre, para docs sin edificio
        if (torreUsuario) {
          const listeners = [];
          listeners.push(onSnapshot(query(colRef, where("torre", "==", torreUsuario)), (snap) => {
            const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            cacheT = mergeArr(cacheT, arr);
            applyMerge();
          }));
          listeners.push(onSnapshot(query(colRef, where("torreId", "==", torreUsuario)), (snap) => {
            const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            cacheT = mergeArr(cacheT, arr);
            applyMerge();
          }));
          listeners.push(onSnapshot(query(colRef, where("torreCode", "==", torreUsuario)), (snap) => {
            const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            cacheT = mergeArr(cacheT, arr);
            applyMerge();
          }));
          listeners.push(onSnapshot(query(colRef, where("torres", "array-contains", torreUsuario)), (snap) => {
            const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            cacheT = mergeArr(cacheT, arr);
            applyMerge();
          }));
          unsubT = listeners;
        }
      } catch (e) {
        console.error("Error al escuchar eventos:", e);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      if (unsubA) unsubA();
      if (unsubB) unsubB();
      unsubT.forEach((u) => u && u());
    };
  }, []);

  function mergeArr(prev, add) {
    const m = new Map(prev.map((x) => [x.id, x]));
    add.forEach((x) => m.set(x.id, x));
    return Array.from(m.values());
  }

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
      <Text style={styles.cardTitle}>Eventos y Notificaciones de dashboard</Text>

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
