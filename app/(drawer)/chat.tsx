import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, Button, ScrollView, ActivityIndicator,
  StyleSheet, TouchableOpacity, Alert, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Variables d'environnement (à configurer dans .env)
const API_URL = Constants.expoConfig?.extra?.apiUrl ?? 'https://osnyl1403.pythonanywhere.com';
const API_KEY = Constants.expoConfig?.extra?.apiKey ?? 'ta_cle_secrete';

// Stockage local
const STORAGE_KEY = 'chat_messages';

// Type pour les messages
interface Message {
  text: string;
  isUser: boolean;
}

// Composant logo J animé (simple pulsation)
const LogoJ = () => (
  <View style={styles.logoContainer}>
    <Text style={styles.logoText}>J</Text>
  </View>
);

// Texte défilant (marquee)
const Marquee = () => {
  const scrollRef = useRef(null);
  const [text] = useState('Salutations, Je suis NJavis votre Agent IA. Avez-vous une demande à formuler ?');
  return (
    <View style={styles.marqueeContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollRef}>
        <Text style={styles.marqueeText}>{text}</Text>
      </ScrollView>
    </View>
  );
};

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Charger historique au démarrage
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setMessages(JSON.parse(stored));
    } catch (e) {}
  };

  const saveMessages = async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    } catch (e) {}
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    const updatedMessages = [...messages, { text: userMsg, isUser: true }];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await response.json();
      const reply = data.response || 'Désolé, je n\'ai pas compris.';
      const newMessages = [...updatedMessages, { text: reply, isUser: false }];
      setMessages(newMessages);
      saveMessages(newMessages);
      // Synthèse vocale (à activer après installation d'expo-speech)
      // Speech.speak(reply, { language: 'fr' });
    } catch (error) {
      const errorMsg = 'Erreur de connexion au serveur.';
      const newMessages = [...updatedMessages, { text: errorMsg, isUser: false }];
      setMessages(newMessages);
      saveMessages(newMessages);
      Alert.alert('Erreur', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    if (isRecording) return;
    // Pour l'instant, nous allons utiliser une implémentation simple
    // expo-speech-recognition n'est pas disponible dans Expo SDK 54
    // Nous utiliserons une alerte pour l'instant
    Alert.alert('Info', 'La reconnaissance vocale sera implémentée avec une solution alternative.');
  };

  return (
    <View style={styles.container}>
      <LogoJ />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {messages.map((msg, idx) => (
          <View key={idx} style={[styles.messageBubble, msg.isUser ? styles.userBubble : styles.assistantBubble]}>
            <Text style={msg.isUser ? styles.userText : styles.assistantText}>{msg.text}</Text>
          </View>
        ))}
        {loading && <ActivityIndicator style={styles.loader} />}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Écrire un message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={startRecording} disabled={isRecording} style={styles.micButton}>
          <Text style={styles.micText}>🎤</Text>
        </TouchableOpacity>
        <Button title="Envoyer" onPress={() => sendMessage(message)} disabled={loading} />
      </View>
      <Marquee />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  logoContainer: { alignItems: 'center', marginTop: 20, marginBottom: 10 },
  logoText: { fontSize: 48, fontWeight: 'bold', color: '#FFD700', textShadowColor: '#FFD700', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  scrollView: { flex: 1, marginBottom: 16 },
  scrollContent: { flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: 16 },
  messageBubble: { padding: 12, marginVertical: 4, borderRadius: 12, maxWidth: '80%' },
  userBubble: { backgroundColor: '#FFD700', alignSelf: 'flex-end' },
  assistantBubble: { backgroundColor: '#333', alignSelf: 'flex-start' },
  userText: { color: '#000' },
  assistantText: { color: '#FFF' },
  loader: { marginTop: 8, alignSelf: 'center' },
  inputContainer: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
  textInput: { flex: 1, borderWidth: 1, borderColor: '#FFD700', borderRadius: 8, padding: 8, color: '#FFF', backgroundColor: '#222' },
  micButton: { padding: 8, backgroundColor: '#333', borderRadius: 40, marginRight: 8 },
  micText: { fontSize: 20, color: '#FFD700' },
  marqueeContainer: { backgroundColor: '#111', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#FFD700' },
  marqueeText: { color: '#FFD700', fontSize: 14, textAlign: 'center' },
});
