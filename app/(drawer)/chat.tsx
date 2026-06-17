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
  Image,
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
  animated?: boolean;
}

function TypingText({ text, style, onComplete }: { text: string; style: any; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <Text style={style}>{displayedText}</Text>;
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
        setMessages(parsed.map((m: Message) => ({ ...m, animated: true })));
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
    const updatedMessages = [...messages, { text: userMsg, isUser: true, animated: true }];
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
      const newMessages = [...updatedMessages, { text: reply, isUser: false, animated: false }];
      setMessages(newMessages);
      saveMessages(newMessages);
    } catch (error) {
      const errorMsg = 'Erreur de connexion au serveur.';
      const newMessages = [...updatedMessages, { text: errorMsg, isUser: false, animated: false }];
      setMessages(newMessages);
      saveMessages(newMessages);
      Alert.alert('Erreur', errorMsg);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const markAnimated = (idx: number) => {
    setMessages(prev => prev.map((m, i) => i === idx ? { ...m, animated: true } : m));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      Alert.alert('🎤 Enregistrement', "L'enregistrement vocal sera disponible prochainement.");
    }
    setIsRecording(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/Jarvis.png')}
              style={styles.headerIcon}
            />
          </View>
          <Text style={styles.headerTitle}>JARVIS</Text>
        </View>
      </View>

      <View style={styles.chatArea}>
        {showBanner && (
          <View style={styles.banner}>
            <Ionicons name="sparkles" size={20} color="#D4D4D4" style={{ marginBottom: 8 }} />
            <Text style={styles.bannerText}>
              Bonjour ! Je suis JARVIS, votre assistant intelligent.{'\n'}Posez-moi vos questions, je suis là pour vous aider.
            </Text>
          </View>
        )}

        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={msg.isUser ? styles.userBubble : styles.assistantBubble}
            >
              {!msg.isUser && !msg.animated ? (
                <TypingText
                  text={msg.text}
                  style={styles.assistantText}
                  onComplete={() => {
                    markAnimated(idx);
                    scrollRef.current?.scrollToEnd({ animated: true });
                  }}
                />
              ) : (
                <Text style={msg.isUser ? styles.userText : styles.assistantText}>{msg.text}</Text>
              )}
            </View>
          ))}
          {loading && (
            <View style={styles.loaderRow}>
              <ActivityIndicator color="#D4D4D4" size="small" />
              <Text style={styles.loaderText}>Jarvis réfléchit...</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#D4D4D4',
  },
  headerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 17,
    color: '#D4D4D4',
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  chatArea: { flex: 1 },
  banner: {
    backgroundColor: '#141414',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D4D4D433',
    alignItems: 'center',
  },
  bannerText: {
    color: '#A8A8A8',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'flex-end', padding: 16, gap: 8 },
  userBubble: {
    backgroundColor: '#D4D4D4',
    alignSelf: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: '75%',
    marginVertical: 2,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    marginVertical: 4,
  },
  userText: { color: '#0A0A0A', fontSize: 15, lineHeight: 21, fontWeight: '600' },
  assistantText: { color: '#F5F5F5', fontSize: 15, lineHeight: 22 },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  loaderText: { color: '#888', fontSize: 13, fontStyle: 'italic' },
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
    backgroundColor: '#D4D4D4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#3A3A3A',
  },
});
