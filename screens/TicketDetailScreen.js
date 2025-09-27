import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';

export default function TicketDetailScreen({ route }) {
  const { ticketId } = route.params || {};
  const [mensajes, setMessages] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!ticketId) return;

    const ticketRef = doc(db, 'tickets_mantenimiento', ticketId);
    getDoc(ticketRef).then((snap) => {
      if (snap.exists()) setTicket({ id: snap.id, ...snap.data() });
    });

    const q = query(
      collection(db, 'tickets_mantenimiento', ticketId, 'mensajes'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(data);
      // Scroll to bottom on new messages
      requestAnimationFrame(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      });
    });
    return () => unsub();
  }, [ticketId]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const user = auth.currentUser;
    try {
      await addDoc(collection(db, 'tickets_mantenimiento', ticketId, 'mensajes'), {
        text,
        senderId: user?.uid || 'anon',
        senderName: user?.displayName || 'Usuario',
        createdAt: serverTimestamp(),
      });
      setInput('');
    } catch (e) {
      console.error('Error enviando mensaje:', e);
    }
  };

  const renderItem = ({ item }) => {
    const isMine = item.senderId === auth.currentUser?.uid;
    return (
      <View style={[styles.messageRow, isMine ? styles.rowRight : styles.rowLeft]}>
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
          {!!item.senderName && !isMine && (
            <Text style={styles.sender}>{item.senderName}</Text>
          )}
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={88}
      >
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {ticket?.titulo || 'Detalle del Ticket'}
          </Text>
          {!!ticket?.status && (
            <Text style={styles.subtitle}>Estado: {ticket.status}</Text>
          )}
        </View>

        <FlatList
          ref={flatListRef}
          data={mensajes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  title: { fontSize: 18, fontWeight: '600', color: '#111' },
  subtitle: { marginTop: 2, color: '#666' },
  listContent: { padding: 12, paddingBottom: 16 },
  messageRow: { marginVertical: 4, flexDirection: 'row' },
  rowRight: { justifyContent: 'flex-end' },
  rowLeft: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 },
  bubbleMine: { backgroundColor: '#DCF8C6', borderTopRightRadius: 4 },
  bubbleOther: { backgroundColor: '#F1F1F1', borderTopLeftRadius: 4 },
  sender: { fontSize: 11, color: '#555', marginBottom: 2 },
  messageText: { fontSize: 15, color: '#111' },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 0.5, borderTopColor: '#eee' },
  input: { flex: 1, backgroundColor: '#f7f7f7', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, marginRight: 8 },
  sendBtn: { backgroundColor: '#111', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  sendText: { color: '#fff', fontWeight: '600' },
};

