import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import {
  UberColors,
  UberTypography,
  UberSpacing,
  UberShadows,
  UberBorderRadius,
} from "../styles/uberTheme";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Usuario actual:", currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Intentando cerrar sesión...");
      await signOut(auth);
      console.log("Cierre de sesión exitoso");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Gestiona tu cuenta y configuración
          </Text>

          {/* Profile Info */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {user?.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {user?.displayName
                      ? user.displayName[0].toUpperCase()
                      : "U"}
                  </Text>
                )}
              </View>
            </View>
            <Text style={styles.userName}>
              {user?.displayName || "Usuario sin nombre"}
            </Text>
            <Text style={styles.userEmail}>
              {user?.email || "correo@ejemplo.com"}
            </Text>
          </View>

          {/* Profile Options */}
          <View style={styles.optionCard}>
            <Text style={styles.cardTitle}>Cuenta</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={[styles.optionText, styles.logoutText]}>
                Cerrar Sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UberColors.backgroundSecondary,
  },
  header: {
    backgroundColor: UberColors.backgroundSecondary,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: UberSpacing.lg,
  },
  headerTitle: {
    fontSize: UberTypography.fontSize["3xl"],
    fontWeight: "700",
    color: UberColors.textPrimary,
    textAlign: "left",
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: UberSpacing.lg,
  },
  subtitle: {
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary,
    marginBottom: UberSpacing.xl,
    textAlign: "left",
  },
  profileCard: {
    backgroundColor: UberColors.white,
    borderRadius: UberBorderRadius.lg,
    padding: UberSpacing.lg,
    marginBottom: UberSpacing.md,
    alignItems: "center",
    ...UberShadows.small,
  },
  avatarContainer: {
    marginBottom: UberSpacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: UberColors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: UberTypography.fontSize["2xl"],
    fontFamily: UberTypography.fontFamilyBold,
    color: UberColors.white,
  },
  userName: {
    fontSize: UberTypography.fontSize.xl,
    fontFamily: UberTypography.fontFamilySemiBold,
    color: UberColors.textPrimary,
    marginBottom: UberSpacing.xs,
  },
  userEmail: {
    fontSize: UberTypography.fontSize.sm,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary,
  },
  optionCard: {
    backgroundColor: UberColors.white,
    borderRadius: UberBorderRadius.lg,
    padding: UberSpacing.lg,
    marginBottom: UberSpacing.md,
    ...UberShadows.small,
  },
  cardTitle: {
    fontSize: UberTypography.fontSize.xl,
    fontWeight: "700",
    color: UberColors.textPrimary,
    marginBottom: UberSpacing.md,
    letterSpacing: -0.3,
  },
  optionText: {
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textPrimary,
  },
  logoutButton: {
    paddingVertical: UberSpacing.md,
  },
  logoutText: {
    color: UberColors.red,
    fontFamily: UberTypography.fontFamilySemiBold,
  },
});
