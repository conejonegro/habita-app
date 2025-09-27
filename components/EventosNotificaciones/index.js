import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { UberColors } from "../../styles/uberTheme";
import styles from "../../styles/DasboardScreen.styles";

export default function EventosNotificaciones({ navigation }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Eventos y Notificaciones</Text>

      <View style={styles.listContainer}>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => navigation.navigate("NotificationsScreen")}
        >
          <View style={styles.listIcon}>
            <FontAwesome name="calendar" size={18} color={UberColors.textPrimary} />
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
            <FontAwesome name="tint" size={18} color={UberColors.textPrimary} />
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
            <FontAwesome name="wrench" size={18} color={UberColors.textPrimary} />
          </View>
          <View style={styles.listContent}>
            <Text style={styles.listTitle}>Mantenimiento general</Text>
            <Text style={styles.listSubtitle}>Vie, 20 de Oct</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

