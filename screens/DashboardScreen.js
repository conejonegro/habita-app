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
import { auth } from "../firebase/firebaseConfig";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/DasboardScreen.styles";
import Mantenimiento from "../components/Mantenimiento";
import PagosSection from "../components/Pagos";
import EventosNotificaciones from "../components/EventosNotificaciones";

export default function DashboardScreen({ navigation }) {
  const [userName, setUserName] = useState("");


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
    fetchUserName();
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
        <PagosSection navigation={navigation} />

        {/* Eventos y Notificaciones */}
        <EventosNotificaciones navigation={navigation} />

        {/* Crear Ticket de Mantenimiento */}
        <Mantenimiento navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
}
