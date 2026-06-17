import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Image, // 👈 Import ajouté pour l'image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

const API_URL = Constants.expoConfig?.extra?.apiUrl ?? 'https://osnyl1403.pythonanywhere.com';
const API_KEY = Constants.expoConfig?.extra?.apiKey ?? 'ta_cle_secrete';

const STORAGE_KEY = 'chat_messages';

interface Message {
  text: string;
  isUser: boolean;
}

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(parsed);
        if (parsed.length > 0) setShowBanner(false);
      }
    } catch (e) {}
  };

  const saveMessages = async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    } catch (e) {}
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    if (showBanner) setShowBanner(false);

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
      const reply = data.response || "Désolé, je n'ai pas compris.";
      const newMessages = [...updatedMessages, { text: reply, isUser: false }];
      setMessages(newMessages);
      saveMessages(newMessages);
    } catch (error) {
      const errorMsg = 'Erreur de connexion au serveur.';
      const newMessages = [...updatedMessages, { text: errorMsg, isUser: false }];
      setMessages(newMessages);
      saveMessages(newMessages);
      Alert.alert('Erreur', errorMsg);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      Alert.alert('🎤 Enregistrement', 'L\'enregistrement vocal sera disponible prochainement.');
    }
    setIsRecording(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* En‑tête avec image et titre */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/Jarvis.png')}
          style={styles.headerIcon}
        />
        <Text style={styles.headerTitle}>JARVIS</Text>
      </View>

      {showBanner && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Salutations, je suis JARVIS, votre assistant IA. Comment puis-je vous aider ?
          </Text>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, idx) => (
          <View
            key={idx}
            style={[styles.messageBubble, msg.isUser ? styles.userBubble : styles.assistantBubble]}
          >
            <Text style={msg.isUser ? styles.userText : styles.assistantText}>{msg.text}</Text>
          </View>
        ))}
        {loading && <ActivityIndicator style={styles.loader} color="#E5E5E5" />}
      </ScrollView>

      <View style={styles.inputContainer}>
        {/* Bouton + */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Ajouter',
              'Choisissez une action',
              [
                { text: '📎 Ajouter un fichier', onPress: () => {} },
                { text: '🌍 Traduire', onPress: () => {} },
                { text: '📷 Prendre une photo', onPress: () => {} },
                { text: 'Annuler', style: 'cancel' },
              ]
            );
          }}
          style={styles.iconButton}
        >
          <Ionicons name="add" size={24} color="#E5E5E5" />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Écrire un message..."
          placeholderTextColor="#6B6B6B"
          multiline
        />

        {/* Bouton enregistrement studio (cercle rouge) */}
        <TouchableOpacity
          onPress={toggleRecording}
          style={[styles.iconButton, isRecording && styles.iconButtonActive]}
        >
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: isRecording ? '#FF3B30' : '#E5E5E5',
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => sendMessage(message)}
          disabled={loading || !message.trim()}
          style={[styles.sendButton, (!message.trim() || loading) && styles.sendButtonDisabled]}
        >
          <Ionicons name="arrow-up" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  headerIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 18,
    color: '#E5E5E5',
    fontWeight: 'bold',
    letterSpacing: 4,
    marginTop: 4,
  },
  banner: {
    backgroundColor: '#161616',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  bannerText: {
    color: '#A8A8A8',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'flex-end', padding: 16, gap: 4 },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 4,
    borderRadius: 16,
    maxWidth: '82%',
  },
  userBubble: {
    backgroundColor: '#2C2C2C',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userText: { color: '#E5E5E5', fontSize: 15, lineHeight: 21 },
  assistantText: { color: '#F5F5F5', fontSize: 15, lineHeight: 21 },
  loader: { marginTop: 8, marginBottom: 8, alignSelf: 'center' },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1F1F1F',
    backgroundColor: '#0A0A0A',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonActive: {
    backgroundColor: '#E5E5E5',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#F5F5F5',
    backgroundColor: '#141414',
    maxHeight: 110,
    fontSize: 15,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#3A3A3A',
  },
});