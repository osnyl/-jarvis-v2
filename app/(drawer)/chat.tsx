import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from 'expo-router/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

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

interface MenuItem {
  icon: string;
  label: string;
  action: () => void;
}

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const speechIdRef = useRef<boolean>(false);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    const checkSpeech = setInterval(async () => {
      const speaking = await Speech.isSpeakingAsync();
      setIsSpeaking(speaking);
    }, 500);
    return () => clearInterval(checkSpeech);
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

  const stopSpeaking = useCallback(async () => {
    await Speech.stop();
    speechIdRef.current = false;
    setIsSpeaking(false);
  }, []);

  const speakMessage = useCallback((text: string) => {
    Speech.stop();
    Speech.speak(text, { 
      language: 'fr', 
      rate: 0.9,
      onDone: () => {
        setIsSpeaking(false);
        speechIdRef.current = false;
      },
      onStopped: () => {
        setIsSpeaking(false);
        speechIdRef.current = false;
      },
    });
    speechIdRef.current = true;
    setIsSpeaking(true);
  }, []);

  const sendMessage = async (text: string, forceSearch: boolean = false) => {
    if (!text.trim()) return;
    if (showBanner) setShowBanner(false);

    await stopSpeaking();

    const userMsg = text.trim();
    const updatedMessages = [...messages, { text: userMsg, isUser: true, animated: true }];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setMessage('');
    setLoading(true);
    Keyboard.dismiss();

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({ 
          message: userMsg,
          want_audio: false,
          force_search: forceSearch,
        }),
      });
      const data = await response.json();
      const reply = data.response || "Desole, je n'ai pas compris.";
      const newMessages = [...updatedMessages, { text: reply, isUser: false, animated: false }];
      setMessages(newMessages);
      saveMessages(newMessages);
      
      speakMessage(reply);
      
    } catch (error) {
      const errorMsg = 'Erreur de connexion au serveur.';
      const newMessages = [...updatedMessages, { text: errorMsg, isUser: false, animated: false }];
      setMessages(newMessages);
      saveMessages(newMessages);
      Alert.alert('Erreur', errorMsg);
    } finally {
      setLoading(false);
      setIsSearching(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleSearch = () => {
    if (!message.trim()) {
      Alert.alert('Recherche web', 'Ecrivez d\'abord votre question');
      return;
    }
    setIsSearching(true);
    setModalVisible(false);
    sendMessage(message, true);
  };

  const handleSendPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) return;
      
      const file = result.assets[0];
      if (file.size && file.size > 5 * 1024 * 1024) {
        Alert.alert('Fichier trop grand', 'Limite: 5MB');
        return;
      }
      
      setLoading(true);
      setModalVisible(false);
      
      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      const response = await fetch(`${API_URL}/upload_pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({
          filename: file.name,
          pdf_base64: base64,
        }),
      });
      
      const data = await response.json();
      const reply = data.response || "J'ai analysé votre PDF.";
      
      const newMessages = [
        ...messages, 
        { text: `PDF: ${file.name}`, isUser: true, animated: true },
        { text: reply, isUser: false, animated: false }
      ];
      setMessages(newMessages);
      saveMessages(newMessages);
      speakMessage(reply);
      
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer le PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePDF = () => {
    setModalVisible(false);
    Alert.alert(
      'Créer un PDF',
      'Quelles conversations inclure ?',
      [
        { text: 'Conversation actuelle', onPress: () => generatePDF(false) },
        { text: 'Toutes les conversations', onPress: () => generatePDF(true) },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const generatePDF = async (allConversations: boolean) => {
    try {
      setLoading(true);
      
      const messagesToSend = allConversations ? messages : messages.slice(-10);
      
      const response = await fetch(`${API_URL}/generate_pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({
          messages: messagesToSend,
          title: 'Conversation JARVIS',
        }),
      });
      
      const data = await response.json();
      
      if (data.pdf_base64) {
        const pdfPath = (FileSystem as any).documentDirectory + 'jarvis_conversation.pdf';
        await FileSystem.writeAsStringAsync(pdfPath, data.pdf_base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        Alert.alert('PDF créé', 'Le PDF a été sauvegardé dans les documents');
      }
      
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleMicro = async () => {
    Alert.alert('Micro', 'Fonctionnalite bientot disponible');
  };

  const markAnimated = (idx: number) => {
    setMessages(prev => prev.map((m, i) => i === idx ? { ...m, animated: true } : m));
  };

  const menuItems: MenuItem[] = [
    { icon: 'search-outline', label: 'Recherche web', action: handleSearch },
    { icon: 'document-attach-outline', label: 'Envoyer PDF', action: handleSendPDF },
    { icon: 'download-outline', label: 'Créer PDF', action: handleCreatePDF },
    { icon: 'camera-outline', label: 'Photo', action: () => Alert.alert('Camera', 'Bientot disponible') },
    { icon: 'image-outline', label: 'Galerie', action: () => Alert.alert('Galerie', 'Bientot disponible') },
    { icon: 'sparkles-outline', label: 'Image IA', action: () => Alert.alert('Image IA', 'Bientot disponible') },
  ];

  const renderMenuItem = (item: MenuItem, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.menuItem}
      onPress={() => {
        setModalVisible(false);
        item.action();
      }}
    >
      <Ionicons name={item.icon as any} size={24} color="#FFFFFF" />
      <Text style={styles.menuLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <View style={styles.drawerButton}>
            <DrawerToggleButton tintColor="#FFFFFF" />
          </View>
          
          <Image
            source={require('../../assets/Jarvis.png')}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>JARVIS</Text>
          
          {isSpeaking && (
            <TouchableOpacity onPress={stopSpeaking} style={styles.audioButton}>
              <Ionicons name="stop-circle" size={24} color="#FF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.chatArea}>
        {showBanner && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Bonjour ! Je suis JARVIS, votre assistant intelligent. Posez-moi vos questions.
            </Text>
          </View>
        )}

        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
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
              <ActivityIndicator color="#888888" size="small" />
              <Text style={styles.loaderText}>
                {isSearching ? 'Recherche web en cours...' : 'Jarvis reflechit...'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.bottom : 0}
      >
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.iconButton}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TextInput
            style={[styles.textInput, { maxHeight: 100 }]}
            value={message}
            onChangeText={setMessage}
            placeholder="Ecrire un message..."
            placeholderTextColor="#666666"
            multiline
          />

          {isSpeaking ? (
            <TouchableOpacity onPress={stopSpeaking} style={[styles.iconButton, styles.stopButton]}>
              <Ionicons name="stop" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleMicro}
              style={styles.iconButton}
            >
              <Ionicons name="mic" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => sendMessage(message)}
            disabled={loading || !message.trim()}
            style={[styles.sendButton, (!message.trim() || loading) && styles.sendButtonDisabled]}
          >
            <Ionicons name="arrow-up" size={20} color="#000000" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerButton: {
    marginLeft: -8,
  },
  headerIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 2,
    flex: 1,
  },
  audioButton: {
    padding: 4,
  },
  chatArea: {
    flex: 1,
  },
  banner: {
    backgroundColor: '#111111',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
  },
  bannerText: {
    color: '#888888',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: 16,
    gap: 8,
  },
  userBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    paddingVertical: 4,
  },
  userText: {
    color: '#000000',
    fontSize: 15,
    lineHeight: 21,
  },
  assistantText: {
    color: '#E5E5E5',
    fontSize: 15,
    lineHeight: 22,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  loaderText: {
    color: '#666666',
    fontSize: 13,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    backgroundColor: '#000000',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#FF4444',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    backgroundColor: '#111111',
    fontSize: 15,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#333333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111111',
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
    paddingVertical: 14,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 10,
  },
  menuLabel: {
    color: '#888888',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 6,
  },
});