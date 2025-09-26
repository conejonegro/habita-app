import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UberColors, UberTypography, UberSpacing, UberShadows, UberBorderRadius } from '../styles/uberTheme';
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";

const NotificationsScreen = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = null;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const user = auth.currentUser;
        if (!user) {
          setItems([]);
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        // Obtener edificioRef desde usuarios/{uid}
        const perfilRef = doc(db, "usuarios", user.uid);
        const perfilSnap = await getDoc(perfilRef);
        if (!perfilSnap.exists()) {
          setItems([]);
          setError('No existe perfil en "usuarios".');
          setLoading(false);
          return;
        }
        const dataPerfil = perfilSnap.data();
        const edificioRef = dataPerfil?.edificioRef || null;
        if (!edificioRef) {
          setItems([]);
          setError("Sin edificio asignado.");
          setLoading(false);
          return;
        }

        const colRef = collection(db, "notificaciones");
        const q = query(colRef, where("edificioRef", "==", edificioRef));

        unsubscribe = onSnapshot(
          q,
          (snap) => {
            if (cancelled) return;
            const docs = snap.docs.map((d) => {
              const data = d.data();
              // Campos esperados: nombre, descripcion, edificioRef, opcional fecha/createdAt
              const title = data.nombre || "Notificación";
              const description = data.descripcion || "";
              let dateStr = "";
              const ts = data.fecha || data.createdAt;
              if (ts?.toDate) {
                const dt = ts.toDate();
                dateStr = dt.toLocaleString();
              }
              return { id: d.id, title, description, date: dateStr };
            });
            setItems(docs);
            setLoading(false);
          },
          (err) => {
            console.error(err);
            setError("Error cargando notificaciones");
            setLoading(false);
          }
        );
      } catch (e) {
        console.error(e);
        setError("Error cargando notificaciones");
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>
      {loading ? (
        <View style={{ padding: UberSpacing.lg }}>
          <ActivityIndicator color={UberColors.textPrimary} />
        </View>
      ) : error ? (
        <View style={{ padding: UberSpacing.lg }}>
          <Text style={{ color: UberColors.red }}>{error}</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={{ padding: UberSpacing.lg }}>
          <Text style={{ color: UberColors.textSecondary }}>No hay notificaciones.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.notificationCard}>
              <View style={styles.titleContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title} onPress={() => toggleExpand(item.id)}>
                    {item.title}
                  </Text>
                  {item.date ? <Text style={styles.date}>{item.date}</Text> : null}
                </View>
                <Ionicons name={expandedId === item.id ? 'chevron-up' : 'chevron-down'} size={16} color="gray" style={styles.icon} />
              </View>
              {expandedId === item.id && (
                <View style={styles.expandedContent}>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UberColors.backgroundSecondary,
  },
  headerContainer: {
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
  notificationCard: {
    padding: UberSpacing.lg,
    marginBottom: UberSpacing.md,
    marginHorizontal: UberSpacing.lg,
    borderRadius: UberBorderRadius.lg,
    backgroundColor: UberColors.white,
    ...UberShadows.small,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 'auto',
  },
  title: {
    fontSize: UberTypography.fontSize.xl,
    fontWeight: '700',
    color: UberColors.textPrimary,
    letterSpacing: -0.3,
  },
  date: {
    fontSize: UberTypography.fontSize.sm,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary,
    marginTop: UberSpacing.xs,
  },
  expandedContent: {
    marginTop: UberSpacing.sm,
    padding: UberSpacing.sm,
    backgroundColor: UberColors.gray50,
    borderRadius: UberBorderRadius.sm,
  },
  description: {
    fontSize: UberTypography.fontSize.sm,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textPrimary,
    lineHeight: UberTypography.lineHeight.relaxed * UberTypography.fontSize.sm,
  },
});

export default NotificationsScreen;
