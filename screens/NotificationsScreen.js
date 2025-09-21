import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UberColors, UberTypography, UberSpacing, UberShadows, UberBorderRadius } from '../styles/uberTheme';

const notifications = [
  { id: '1', title: 'Corte de agua', date: 'Mañana a las 10:00 AM', description: 'Se realizará un corte de agua por mantenimiento en las tuberías principales.' },
  { id: '2', title: 'Mantenimiento general', date: 'Vie, 20 de Oct', description: 'Se llevará a cabo un mantenimiento general en las áreas comunes del edificio.' },
  { id: '3', title: 'Junta de condominio', date: 'Lun, 14 de Oct', description: 'Reunión para discutir temas importantes relacionados con el condominio.' },
];

const NotificationsScreen = () => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <View style={styles.titleContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title} onPress={() => toggleExpand(item.id)}>
                  {item.title}
                </Text>
                <Text style={styles.date}>{item.date}</Text>
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