import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const MaintenanceTicketScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // Aquí puedes manejar el envío del ticket, por ejemplo, enviarlo a un servidor
    console.log('Ticket enviado:', { title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Levantar Ticket de Mantenimiento</Text>
      <TextInput
        style={styles.input}
        placeholder="Título del problema"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción del problema"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Enviar Ticket" onPress={handleSubmit} />
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
});

export default MaintenanceTicketScreen;