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
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from 'expo-router/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';

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
  const [showBanner, setShowBanner] = useState(true);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
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
      
      if (isSpeechEnabled) {
        Speech.speak(reply, { language: 'fr', rate: 0.9 });
      }
      
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

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
    Alert.alert(isSpeechEnabled ? '🔇 Audio désactivé' : '🔊 Audio activé');
  };

  const menuItems = [
    { icon: '📷', label: 'Prendre une photo', action: () => Alert.alert('📷 Caméra', 'Fonctionnalité bientôt disponible') },
    { icon: '🖼️', label: 'Choisir une photo', action: () => Alert.alert('🖼️ Galerie', 'Fonctionnalité bientôt disponible') },
    { icon: '📁', label: 'Ajouter un fichier', action: () => Alert.alert('📁 Fichier', 'Fonctionnalité bientôt disponible') },
    { icon: '✨', label: 'Générer une image', action: () => Alert.alert('✨ Image', 'Fonctionnalité bientôt disponible') },
    { icon: '📄', label: 'Créer un brouillon', action: () => Alert.alert('📄 Brouillon', 'Fonctionnalité bientôt disponible') },
    { icon: '🔬', label: 'Recherche approfondie', action: () => Alert.alert('🔬 Recherche', 'Fonctionnalité bientôt disponible') },
    { icon: '🎙️', label: 'Créer un podcast', action: () => Alert.alert('🎙️ Podcast', 'Fonctionnalité bientôt disponible') },
  ];

  const renderMenuItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.menuItem}
      onPress={() => {
        setModalVisible(false);
        item.action();
      }}
    >
      <Text style={styles.menuIcon}>{item.icon}</Text>
      <Text style={styles.menuLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER FIXE */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <DrawerToggleButton />
            <Image
              source={require('../../assets/Jarvis.png')}
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>JARVIS</Text>
            <TouchableOpacity onPress={toggleSpeech} style={styles.audioToggle}>
              <Ionicons
                name={isSpeechEnabled ? 'volume-high' : 'volume-mute'}
                size={22}
                color={isSpeechEnabled ? '#FFD700' : '#666'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ZONE DE CHAT */}
        <View style={styles.chatArea}>
          {showBanner && (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                Bonjour ! Je suis JARVIS, votre assistant intelligent. Posez-moi vos questions, je suis là pour vous aider.
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

        {/* BARRE DE SAISIE AVEC KEYBOARDAVOIDINGVIEW */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
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
              onPress={() => Alert.alert('🎤 Enregistrement', 'Fonctionnalité bientôt disponible')}
              style={styles.iconButton}
            >
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: '#E5E5E5',
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

        {/* MODAL MENU + */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.menuGrid}>
                {menuItems.map(renderMenuItem)}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    color: '#D4D4D4',
    fontWeight: 'bold',
    letterSpacing: 3,
    flex: 1,
  },
  audioToggle: {
    padding: 4,
  },
  chatArea: { flex: 1 },
  banner: {
    backgroundColor: '#141414',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  bannerText: {
    color: '#A8A8A8',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'flex-end', padding: 16, gap: 6 },
  userBubble: {
    backgroundColor: '#D4D4D4',
    alignSelf: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: '75%',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  userText: { color: '#0A0A0A', fontSize: 15, lineHeight: 21 },
  assistantText: { color: '#F5F5F5', fontSize: 15, lineHeight: 22 },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#141414',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  menuIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  menuLabel: {
    color: '#A8A8A8',
    fontSize: 11,
    textAlign: 'center',
  },
});