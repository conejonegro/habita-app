import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { UberColors, UberTypography, UberSpacing, UberShadows, UberBorderRadius } from '../styles/uberTheme';
import { auth, db } from '../firebase/firebaseConfig';
import { addDoc, collection, serverTimestamp, doc, setDoc } from 'firebase/firestore';

const MaintenanceTicketScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

const handleSubmit = async () => {
  try {
    const user = auth.currentUser;
    if (!title || !description) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // fecha actual formateada
    const now = new Date();
    const fecha = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    // nombre y apellido del usuario
    const nombreCompleto = user?.displayName || 'Usuario Desconocido';
    const [nombre, apellido] = nombreCompleto.split(' ');
    const nombreId = `${nombre || 'Anon'}-${apellido || 'N/A'}`;

    // construir ID personalizado
    const customId = `${fecha}_${nombreId}`;

    const newTicket = {
      titulo: title,
      descripcion: description,
      status: 'abierto',
      prioridad: 'media',
      categoria: 'general',
      imagenes: [],
      userId: user?.uid || null,
      userName: nombreCompleto,
      userEmail: user?.email || 'sin-correo',
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp(),
      asignadoA: null,
      notas: [],
    };

    // setDoc con ID custom
    await setDoc(doc(db, 'tickets_mantenimiento', customId), newTicket);

    Alert.alert('Éxito', `Tu ticket ha sido enviado con ID: ${customId}`);
    setTitle('');
    setDescription('');
  } catch (error) {
    console.error('Error al enviar el ticket:', error);
    Alert.alert('Error', 'No se pudo enviar el ticket');
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.header}>Levantar Ticket de Mantenimiento</Text>
          <Text style={styles.subtitle}>Describe el problema que necesitas resolver</Text>
          
          <View style={styles.formCard}>
            <Text style={styles.label}>Título del problema</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Fuga de agua en el baño"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={UberColors.textSecondary}
            />
          </View>
          
          <View style={styles.formCard}>
            <Text style={styles.label}>Descripción detallada</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe el problema con el mayor detalle posible..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor={UberColors.textSecondary}
            />
          </View>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Enviar Ticket</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: UberColors.backgroundSecondary },
  scrollView: { flex: 1 },
  content: { padding: UberSpacing.lg },
  header: {
    fontSize: UberTypography.fontSize['3xl'],
    fontWeight: '700',
    marginBottom: UberSpacing.sm,
    color: UberColors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary,
    marginBottom: UberSpacing.xl,
    lineHeight: UberTypography.lineHeight.relaxed * UberTypography.fontSize.base,
  },
  formCard: {
    backgroundColor: UberColors.white,
    borderRadius: UberBorderRadius.lg,
    padding: UberSpacing.lg,
    marginBottom: UberSpacing.lg,
    ...UberShadows.small,
  },
  label: {
    fontSize: UberTypography.fontSize.lg,
    fontWeight: '700',
    color: UberColors.textPrimary,
    marginBottom: UberSpacing.sm,
    letterSpacing: -0.2,
  },
  input: {
    borderWidth: 1,
    borderColor: UberColors.border,
    borderRadius: UberBorderRadius.md,
    paddingVertical: UberSpacing.md,
    paddingHorizontal: UberSpacing.lg,
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textPrimary,
    backgroundColor: UberColors.white,
  },
  textArea: { height: 120, textAlignVertical: 'top' },
  submitButton: {
    backgroundColor: UberColors.buttonPrimary,
    borderRadius: UberBorderRadius['3xl'],
    paddingVertical: UberSpacing.lg,
    paddingHorizontal: UberSpacing.lg,
    alignSelf: 'flex-start',
    marginTop: UberSpacing.md,
    ...UberShadows.small,
  },
  submitButtonText: {
    color: UberColors.buttonText,
    fontSize: UberTypography.fontSize.lg,
    fontFamily: UberTypography.fontFamilySemiBold,
  },
});

export default MaintenanceTicketScreen;
