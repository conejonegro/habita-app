import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    <View style={styles.container}>
      <Text style={styles.header}>Notificaciones</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notificationCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#f7f7f7',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 'auto',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  expandedContent: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e8e8e8',
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
});

export default NotificationsScreen;