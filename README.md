Habita App (Expo React Native)

Aplicación móvil para condóminos con módulos de autenticación, tablero de inicio, tickets de mantenimiento, pagos, notificaciones, soporte y perfil. Construida con Expo, React Native y Firebase.

## Requisitos
- Node.js 18+ y npm
- Expo CLI (`npm i -g expo` recomendado)
- iOS Simulator (Xcode) o Android Emulator (Android Studio) o dispositivo físico con la app Expo Go

## Configuración
1. Instalar dependencias:
   - `npm install`
2. Variables de entorno (Firebase):
   - Copia `.env.example` a `.env` y completa tus credenciales:
     - `cp .env.example .env`
   - Claves esperadas por `firebase/firebaseConfig.js`:
     - `EXPO_PUBLIC_FIREBASE_API_KEY`
     - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
     - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `EXPO_PUBLIC_FIREBASE_APP_ID`
   - Nota: Al usar el prefijo `EXPO_PUBLIC_`, Expo inyecta estos valores en tiempo de ejecución.

## Scripts
- `npm run start` — Arranca el servidor de desarrollo de Expo
- `npm run ios` — Abre iOS Simulator y ejecuta la app
- `npm run android` — Abre Android Emulator y ejecuta la app
- `npm run web` — Ejecuta versión web (experimental con React Native Web)

## Ejecución
1. Inicia el proyecto: `npm run start`
2. Elige una plataforma: presiona `i` (iOS), `a` (Android) o `w` (Web) en la terminal de Expo, o escanea el QR con Expo Go.

## Estructura del proyecto
- `App.js` — Navegación principal (stack y bottom tabs)
- `screens/` — Pantallas de la app:
  - `LoginScreen.js`, `DashboardScreen.js`
  - `MaintenanceTicketScreen.js`, `TicketDetailScreen.js`
  - `PaymentsScreen.js`, `PaymentSetupScreen.js`
  - `NotificationsScreen.js`, `SupportScreen.js`, `ProfileScreen.js`
- `services/` — Lógica de negocio (p. ej. `paymentsService.js`, `userService.js`)
- `utils/` — Utilidades/local storage (`storage.js`, `tempStore.js`)
- `styles/` — Temas y estilos compartidos
- `firebase/` — Inicialización de Firebase (`firebaseConfig.js`)
- `assets/` — Imágenes, fuentes, etc.

## Tecnologías
- Expo 54, React Native 0.81, React 19
- React Navigation (stack, bottom tabs)
- Firebase (Auth, Firestore)

## Notas y buenas prácticas
- Para cambiar la ruta inicial o tabs, revisar `App.js`.
- Si ves el error “Missing EXPO_PUBLIC_* Firebase env vars”, verifica tu archivo `.env` y reinicia el bundler de Expo.
- Para probar en dispositivo físico, asegúrate de que el teléfono y la computadora estén en la misma red.

## Solución de problemas
- Cache de Metro/Expo: `expo start -c`
- Permisos iOS/Android: revisa `app.json` si agregas capacidades nuevas.
- Dependencias nativas: este proyecto usa Expo Managed; preferir librerías compatibles con Expo.

## Licencia
Este proyecto es privado. Todos los derechos reservados.
