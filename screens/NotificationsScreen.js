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
  const [readIds, setReadIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubA = null;
    let unsubB = null;
    let unsubT = [];
    let cancelled = false;

    // Almacenes locales para combinar resultados de múltiples listeners
    let cacheA = [];
    let cacheB = [];
    let cacheT = [];

    const applyMerge = (perfil) => {
      // Unir por id
      const map = new Map();
      [...cacheA, ...cacheB, ...cacheT].forEach((it) => map.set(it.__id, it));
      let arr = Array.from(map.values());

      // Incluir estados enviados o cerrados; si no hay estado, asumir enviada
      arr = arr.filter((n) => {
        const st = (n.__estado || "enviada").toLowerCase();
        return st === "enviada" || st === "activa" || st === "cerrada";
      });

      // Filtro opcional por torre si el perfil lo especifica y la notificación lo define
      const torreUsuario = perfil?.torre || perfil?.torreCode || perfil?.torreId || null;
      if (torreUsuario) {
        arr = arr.filter((n) => {
          const t = n.__torre || n.__torreCode || null;
          const ts = n.__torres || null; // arreglo opcional
          // Incluir si no especifica torre (general) o coincide
          if (!t && !ts) return true;
          if (t && String(t).toUpperCase() === String(torreUsuario).toUpperCase()) return true;
          if (Array.isArray(ts)) {
            return ts.map((x) => String(x).toUpperCase()).includes(String(torreUsuario).toUpperCase());
          }
          return false;
        });
      }

      // Ordenar por fecha descendente si existe
      arr.sort((a, b) => (b.__time || 0) - (a.__time || 0));

      // Adaptar a items de UI
      const ui = arr.map((d) => ({
        id: d.__id,
        title: d.title,
        description: d.description,
        date: d.date,
        estado: (d.__estado || "enviada").toLowerCase(),
        categoria: d.__categoria || null,
        isNew: !!d.__isNew,
      }));
      setItems(ui);
      setLoading(false);
    };

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

        // Obtener perfil y edificio asignado
        const perfilRef = doc(db, "usuarios", user.uid);
        const perfilSnap = await getDoc(perfilRef);
        if (!perfilSnap.exists()) {
          setItems([]);
          setError('No existe perfil en "usuarios".');
          setLoading(false);
          return;
        }
        const perfil = perfilSnap.data();
        const edificioRef = perfil?.edificioRef || null;
        if (!edificioRef) {
          setItems([]);
          setError("Sin edificio asignado.");
          setLoading(false);
          return;
        }

        const colRef = collection(db, "notificaciones");

        // Listener A: notificaciones con edificioRef (DocumentReference)
        unsubA = onSnapshot(
          query(colRef, where("edificioRef", "==", edificioRef)),
          (snap) => {
            if (cancelled) return;
            cacheA = snap.docs.map((d) => {
              const data = d.data();
              const title = data.nombre || data.titulo || "Notificación";
              const description = data.descripcion || data.descripcionLarga || data.detalle || "";
              let dateStr = "";
              let tms = 0;
              const ts = data.fecha || data.createdAt || data.date;
              if (ts?.toDate) {
                const dt = ts.toDate();
                tms = dt.getTime();
                dateStr = dt.toLocaleString();
              } else if (ts) {
                try { tms = new Date(ts).getTime(); dateStr = new Date(ts).toLocaleString(); } catch {}
              }
            return {
              __id: d.id,
              title,
              description,
              date: dateStr,
              __time: tms,
              __torre: data.torre || data.torreId || null,
              __torreCode: data.torreCode || null,
              __torres: data.torres || null,
              __estado: (data.estado || data.status || "").toLowerCase(),
              __categoria: data.categoria || data.category || data.tipo || null,
              __isNew: (data.nueva ?? data.nuevo ?? data.isNew ?? (data.leida === false)) || false,
            };
          });
          applyMerge(perfil);
          },
          (err) => {
            console.error("Notif edificioRef error:", err);
          }
        );

        // Listener B: notificaciones con edificioId (string) igual al id del ref
        const edificioId = edificioRef.id || null;
        if (edificioId) {
          unsubB = onSnapshot(
            query(colRef, where("edificioId", "==", edificioId)),
            (snap) => {
              if (cancelled) return;
              cacheB = snap.docs.map((d) => {
                const data = d.data();
                const title = data.nombre || data.titulo || "Notificación";
                const description = data.descripcion || data.descripcionLarga || data.detalle || "";
                let dateStr = "";
                let tms = 0;
                const ts = data.fecha || data.createdAt || data.date;
                if (ts?.toDate) {
                  const dt = ts.toDate();
                  tms = dt.getTime();
                  dateStr = dt.toLocaleString();
                } else if (ts) {
                  try { tms = new Date(ts).getTime(); dateStr = new Date(ts).toLocaleString(); } catch {}
                }
                return {
                  __id: d.id,
                  title,
                  description,
                  date: dateStr,
                  __time: tms,
                  __torre: data.torre || data.torreId || null,
                  __torreCode: data.torreCode || null,
                  __torres: data.torres || null,
                  __estado: (data.estado || data.status || "").toLowerCase(),
                  __categoria: data.categoria || data.category || data.tipo || null,
                  __isNew: (data.nueva ?? data.nuevo ?? data.isNew ?? (data.leida === false)) || false,
                };
              });
              applyMerge(perfil);
            },
            (err) => {
              console.error("Notif edificioId error:", err);
            }
          );
        } else {
          cacheB = [];
        }
        // Listeners por torre para docs que no tengan edificio ligado
        const torreUsuario = perfil?.torre || perfil?.torreCode || perfil?.torreId || null;
        if (torreUsuario) {
          const colRef = collection(db, "notificaciones");
          const listeners = [];
          const mapDoc = (snap) => snap.docs.map((d) => {
            const data = d.data();
            const title = data.nombre || data.titulo || "Notificación";
            const description = data.descripcion || data.descripcionLarga || data.detalle || "";
            let dateStr = "";
            let tms = 0;
            const ts = data.fecha || data.createdAt || data.date;
            if (ts?.toDate) {
              const dt = ts.toDate();
              tms = dt.getTime();
              dateStr = dt.toLocaleString();
            } else if (ts) {
              try { tms = new Date(ts).getTime(); dateStr = new Date(ts).toLocaleString(); } catch {}
            }
            return {
              __id: d.id,
              title,
              description,
              date: dateStr,
              __time: tms,
              __torre: data.torre || data.torreId || null,
              __torreCode: data.torreCode || null,
              __torres: data.torres || null,
              __estado: (data.estado || data.status || "").toLowerCase(),
              __categoria: data.categoria || data.category || data.tipo || null,
              __isNew: (data.nueva ?? data.nuevo ?? data.isNew ?? (data.leida === false)) || false,
            };
          });
          listeners.push(onSnapshot(query(colRef, where("torre", "==", torreUsuario)), (snap) => { cacheT = mapDoc(snap); applyMerge(perfil); }));
          listeners.push(onSnapshot(query(colRef, where("torreId", "==", torreUsuario)), (snap) => { cacheT = mergeCache(cacheT, mapDoc(snap)); applyMerge(perfil); }));
          listeners.push(onSnapshot(query(colRef, where("torreCode", "==", torreUsuario)), (snap) => { cacheT = mergeCache(cacheT, mapDoc(snap)); applyMerge(perfil); }));
          listeners.push(onSnapshot(query(colRef, where("torres", "array-contains", torreUsuario)), (snap) => { cacheT = mergeCache(cacheT, mapDoc(snap)); applyMerge(perfil); }));
          unsubT = listeners;
        }
      } catch (e) {
        console.error(e);
        setError("Error cargando notificaciones");
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

  function mergeCache(prev, add) {
    const m = new Map(prev.map((x) => [x.__id, x]));
    add.forEach((x) => m.set(x.__id, x));
    return Array.from(m.values());
  }

  const toggleExpand = (id) => {
    const nextId = expandedId === id ? null : id;
    setExpandedId(nextId);
    if (nextId === id) {
      setReadIds((prev) => new Set(prev).add(id));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Notificaciones screen</Text>
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
          renderItem={({ item }) => {
            const isClosed = (item.estado || "").toLowerCase() === 'cerrada';
            const showNewBorder = item.isNew && !readIds.has(item.id);
            return (
            <View style={[
              styles.notificationCard,
              showNewBorder && styles.notificationCardNew,
            ]}>
              <View style={styles.titleContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title} onPress={() => toggleExpand(item.id)}>
                    {item.title}
                  </Text>
                  {item.date ? <Text style={styles.date}>{item.date}</Text> : null}
                </View>
                <Ionicons name={expandedId === item.id ? 'chevron-up' : 'chevron-down'} size={16} color="gray" style={styles.icon} />
              </View>
              <View style={styles.metaRow}>
                <View style={[styles.chip, isClosed ? styles.chipClosed : styles.chipActive]}>
                  <Text style={[styles.chipText, isClosed ? styles.chipTextClosed : styles.chipTextActive]}>
                    {isClosed ? 'Cerrada' : 'Activa'}
                  </Text>
                </View>
                {item.categoria ? (
                  <View style={[styles.chip, styles.chipCategory]}>
                    <Text style={[styles.chipText, styles.chipTextCategory]}>{item.categoria}</Text>
                  </View>
                ) : null}
              </View>
              {expandedId === item.id && (
                <View style={styles.expandedContent}>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              )}
            </View>
          );}
          }
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
  notificationCardNew: {
    borderWidth: 2,
    borderColor: '#F59E0B', // naranja
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: UberSpacing.sm,
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
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  chipActive: {
    borderColor: '#10B981', // verde
    backgroundColor: 'transparent',
  },
  chipClosed: {
    borderColor: '#9CA3AF', // gris
    backgroundColor: 'transparent',
  },
  chipCategory: {
    borderColor: '#374151', // gris oscuro
    backgroundColor: 'transparent',
  },
  chipText: {
    fontSize: UberTypography.fontSize.xs,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#065F46',
  },
  chipTextClosed: {
    color: '#4B5563',
  },
  chipTextCategory: {
    color: '#111827',
  },
  description: {
    fontSize: UberTypography.fontSize.sm,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textPrimary,
    lineHeight: UberTypography.lineHeight.relaxed * UberTypography.fontSize.sm,
  },
});

export default NotificationsScreen;
