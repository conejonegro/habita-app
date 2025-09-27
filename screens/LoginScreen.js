import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import styles from '../styles/LoginScreen.styles';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    // Forzar selector de cuenta de Google en cada login
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);

    // Información del usuario
    const user = result.user;
    console.log('Usuario logueado:', user);

    // Navegar al MainTabs
    navigation.navigate('MainTabs');
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
  }
};

export default function LoginScreen({ navigation }) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Si el usuario ya está autenticado, redirigir al MainTabs
        navigation.replace('MainTabs');
      }
    });

    return () => unsubscribe(); // Limpiar el listener al desmontar el componente
  }, []);

  return (
    <View style={styles.container}>
      {/* Icono del edificio */}
      <Image
        source={{ uri: 'https://img.icons8.com/ios-filled/100/building.png' }}
        style={styles.logo}
      />

      <Text style={styles.title}>CondoApp</Text>
      <Text style={styles.subtitle}>Bienvenido</Text>
      <Text style={styles.text}>Ingresa a tu condominio fácilmente</Text>

      {/* Botón de Google */}
      <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin}>
        <Text style={styles.googleText}>Login con Google</Text>
      </TouchableOpacity>

      {/* Separador */}
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>o</Text>
        <View style={styles.separatorLine} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.loginText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        ¿No tienes una cuenta?{' '}
        <Text style={{ fontWeight: 'bold' }} onPress={() => navigation.navigate('Register')}>
          Regístrate
        </Text>
      </Text>
    </View>
  );
}
