import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';

const API_URL = Constants.expoConfig?.extra?.apiUrl ?? 'https://osnyl1403.pythonanywhere.com';
const API_KEY = Constants.expoConfig?.extra?.apiKey ?? 'ta_cle_secrete';

const NOTES_KEY = 'reports_notes';
const ARCHIVES_KEY = 'chat_archives'; // ← Clé pour les conversations archivées

interface Archive {
  id: string;
  date: string;
  title: string;
  messages: any[];
  messageCount: number;
}

export default function ReportsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [notes, setNotes] = useState<{ id: string; text: string; date: string; response?: string }[]>([]);
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState<Archive | null>(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  useEffect(() => {
    loadNotes();
    loadArchives();
  }, []);

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTES_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (e) {}
  };

  const loadArchives = async () => {
    try {
      const stored = await AsyncStorage.getItem(ARCHIVES_KEY);
      if (stored) {
        setArchives(JSON.parse(stored));
      }
    } catch (e) {}
  };

  const saveNotes = async (newNotes: any[]) => {
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
      setNotes(newNotes);
    } catch (e) {}
  };

  const saveArchives = async (newArchives: Archive[]) => {
    try {
      await AsyncStorage.setItem(ARCHIVES_KEY, JSON.stringify(newArchives));
      setArchives(newArchives);
    } catch (e) {}
  };

  const handleAskJarvis = async () => {
    if (!text.trim()) {
      Alert.alert('Message vide', 'Ecrivez quelque chose avant de demander a Jarvis.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({ message: `Analyse ce texte et donne-moi des conseils : ${text}` }),
      });
      const data = await response.json();
      const reply = data.response || "Je n'ai pas pu analyser votre texte.";

      const newNote = {
        id: Date.now().toString(),
        text: text,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        response: reply,
      };
      const updatedNotes = [newNote, ...notes];
      saveNotes(updatedNotes);
      setText('');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de contacter Jarvis.');
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = (id: string) => {
    Alert.alert('Supprimer', 'Voulez-vous supprimer cette note ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => {
        const updated = notes.filter((n) => n.id !== id);
        saveNotes(updated);
      }},
    ]);
  };

  const deleteArchive = (id: string) => {
    Alert.alert('Supprimer', 'Supprimer cette conversation archivee ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => {
        const updated = archives.filter((a) => a.id !== id);
        saveArchives(updated);
      }},
    ]);
  };

  const openArchive = (archive: Archive) => {
    setSelectedArchive(archive);
    setShowArchiveModal(true);
  };

  const restoreArchive = async (archive: Archive) => {
    Alert.alert(
      'Restaurer',
      'Charger cette conversation dans le chat ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Restaurer', 
          onPress: async () => {
            await AsyncStorage.setItem('chat_messages', JSON.stringify(archive.messages));
            setShowArchiveModal(false);
            router.push('/(drawer)/chat');
          }
        },
      ]
    );
  };

  const generateArchivePDF = async (archive: Archive) => {
    try {
      const response = await fetch(`${API_URL}/generate_pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({
          messages: archive.messages,
          title: `Conversation du ${archive.date}`,
        }),
      });
      
      const data = await response.json();
      
      if (data.pdf_base64) {
        const pdfPath = (FileSystem as any).documentDirectory + `archive_${archive.id}.pdf`;
        await FileSystem.writeAsStringAsync(pdfPath, data.pdf_base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        Alert.alert('PDF cree', 'Le PDF a ete sauvegarde');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de creer le PDF');
    }
  };

  const handleJarvisAction = (action: string) => {
    if (!text.trim()) {
      Alert.alert('Texte vide', 'Ecrivez quelque chose dans la note rapide.');
      return;
    }
    
    const prompts: Record<string, string> = {
      'Resumer': `Resumes ce texte en quelques phrases : ${text}`,
      'Corriger': `Corriges ce texte (orthographe, grammaire, style) : ${text}`,
      'Developper': `Developpes ce texte avec plus de details : ${text}`,
      'Traduire': `Traduies ce texte en anglais : ${text}`,
      'Expliquer': `Explique ce texte simplement : ${text}`,
    };
    
    setText(prompts[action] || text);
  };

  const renderArchiveItem = (archive: Archive) => (
    <TouchableOpacity 
      key={archive.id} 
      style={styles.archiveCard}
      onPress={() => openArchive(archive)}
      onLongPress={() => deleteArchive(archive.id)}
    >
      <View style={styles.archiveHeader}>
        <Ionicons name="chatbubbles-outline" size={20} color="#FFFFFF" />
        <Text style={styles.archiveTitle} numberOfLines={1}>{archive.title}</Text>
      </View>
      <Text style={styles.archiveMeta}>
        {archive.date} • {archive.messageCount} messages
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RAPPORTS</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* === SECTION ARCHIVES === */}
        <View style={styles.sectionHeader}>
          <Ionicons name="folder-open-outline" size={18} color="#FFFFFF" />
          <Text style={styles.sectionTitle}>Conversations archivees</Text>
          <Text style={styles.sectionCount}>{archives.length}</Text>
        </View>

        {archives.length === 0 ? (
          <Text style={styles.emptyText}>
            Aucune conversation archivee.{'\n'}
            Appuyez sur "Nouvelle discussion" pour archiver.
          </Text>
        ) : (
          <View style={styles.archivesList}>
            {archives.map(renderArchiveItem)}
          </View>
        )}

        {/* === SECTION NOTES RAPIDES === */}
        <View style={styles.inputCard}>
          <View style={styles.labelRow}>
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            <Text style={styles.label}>Note rapide</Text>
          </View>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={6}
            placeholder="Ecrivez votre texte ici..."
            placeholderTextColor="#555555"
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.askButton, loading && styles.askButtonDisabled]}
            onPress={handleAskJarvis}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000000" size="small" />
            ) : (
              <View style={styles.askButtonContent}>
                <Ionicons name="bulb-outline" size={18} color="#000000" />
                <Text style={styles.askButtonText}>Demander a Jarvis de vous aider</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.historyHeader}>
          <Ionicons name="document-text-outline" size={18} color="#FFFFFF" />
          <Text style={styles.historyTitle}>Historique des notes</Text>
        </View>
        
        {notes.length === 0 ? (
          <Text style={styles.emptyText}>Aucune note enregistree.</Text>
        ) : (
          notes.map((note) => (
            <View key={note.id} style={styles.noteCard}>
              <Text style={styles.noteDate}>{note.date}</Text>
              <Text style={styles.noteText}>{note.text}</Text>
              {note.response && (
                <View style={styles.responseBox}>
                  <Text style={styles.responseLabel}>Jarvis</Text>
                  <Text style={styles.responseText}>{note.response}</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => deleteNote(note.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={18} color="#FF4444" />
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={styles.jarvisSection}>
          <TouchableOpacity style={styles.jarvisButton} activeOpacity={0.9}>
            <Ionicons name="sparkles" size={18} color="#000000" />
            <Text style={styles.jarvisButtonText}>Jarvis — Que veux-tu faire ?</Text>
          </TouchableOpacity>
          <View style={styles.optionsRow}>
            {['Resumer', 'Corriger', 'Developper', 'Traduire', 'Expliquer'].map((action) => (
              <TouchableOpacity 
                key={action} 
                style={styles.optionChip} 
                onPress={() => handleJarvisAction(action)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionChipText}>{action}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* === MODAL ARCHIVE === */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showArchiveModal}
        onRequestClose={() => setShowArchiveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Conversation</Text>
              <TouchableOpacity onPress={() => setShowArchiveModal(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {selectedArchive && (
              <>
                <Text style={styles.modalDate}>{selectedArchive.date}</Text>
                <ScrollView style={styles.modalMessages}>
                  {selectedArchive.messages.map((msg: any, idx: number) => (
                    <View key={idx} style={[
                      styles.modalMessage,
                      msg.isUser ? styles.modalUserMsg : styles.modalAiMsg
                    ]}>
                      <Text style={msg.isUser ? styles.modalUserText : styles.modalAiText}>
                        {msg.text}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.modalButton}
                    onPress={() => restoreArchive(selectedArchive)}
                  >
                    <Ionicons name="refresh" size={18} color="#000000" />
                    <Text style={styles.modalButtonText}>Restaurer</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={() => generateArchivePDF(selectedArchive)}
                  >
                    <Ionicons name="download" size={18} color="#FFFFFF" />
                    <Text style={styles.modalButtonTextSecondary}>PDF</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  // === SECTION ARCHIVES ===
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  sectionCount: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '600',
  },
  archivesList: {
    gap: 10,
    marginBottom: 24,
  },
  archiveCard: {
    backgroundColor: '#111111',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  archiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  archiveTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  archiveMeta: {
    color: '#555555',
    fontSize: 12,
  },
  // === NOTES ===
  inputCard: {
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 15,
    minHeight: 120,
    marginBottom: 12,
  },
  askButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  askButtonDisabled: {
    opacity: 0.5,
  },
  askButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  askButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  historyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: '#444444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    lineHeight: 20,
  },
  noteCard: {
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    marginBottom: 12,
  },
  noteDate: {
    color: '#555555',
    fontSize: 11,
    marginBottom: 6,
    fontWeight: '500',
  },
  noteText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  responseBox: {
    backgroundColor: '#0A0A0A',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#FFFFFF',
  },
  responseLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  responseText: {
    color: '#888888',
    fontSize: 13,
    lineHeight: 20,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    padding: 4,
  },
  jarvisSection: {
    marginTop: 24,
    paddingBottom: 20,
  },
  jarvisButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  jarvisButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 14,
  },
  optionChip: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  optionChipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  // === MODAL ===
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  modalDate: {
    color: '#666666',
    fontSize: 13,
    marginBottom: 12,
  },
  modalMessages: {
    maxHeight: 400,
  },
  modalMessage: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: '85%',
  },
  modalUserMsg: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-end',
  },
  modalAiMsg: {
    backgroundColor: '#1A1A1A',
    alignSelf: 'flex-start',
  },
  modalUserText: {
    color: '#000000',
    fontSize: 14,
  },
  modalAiText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  modalButtonSecondary: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  modalButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});