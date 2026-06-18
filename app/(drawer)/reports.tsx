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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl ?? 'https://osnyl1403.pythonanywhere.com';
const API_KEY = Constants.expoConfig?.extra?.apiKey ?? 'ta_cle_secrete';

const NOTES_KEY = 'reports_notes';

export default function ReportsScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [notes, setNotes] = useState<{ id: string; text: string; date: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTES_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (e) {}
  };

  const saveNotes = async (newNotes: any[]) => {
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
      setNotes(newNotes);
    } catch (e) {}
  };

  const handleAskJarvis = async () => {
    if (!text.trim()) {
      Alert.alert('Message vide', 'Écrivez quelque chose avant de demander à Jarvis.');
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
      Alert.alert('✅ Analyse terminée', reply);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de contacter Jarvis.');
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = (id: string) => {
    Alert.alert('Supprimer', 'Voulez-vous supprimer cette note ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', onPress: () => {
        const updated = notes.filter((n) => n.id !== id);
        saveNotes(updated);
      }},
    ]);
  };

  const handleJarvisAction = (action: string) => {
    Alert.alert(`Action Jarvis : ${action}`, `Fonctionnalité ${action} bientôt disponible.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rapports</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.inputCard}>
          <Text style={styles.label}>📝 Note rapide</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={6}
            placeholder="Écrivez votre texte ici..."
            placeholderTextColor="#6B6B6B"
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.askButton, loading && styles.askButtonDisabled]}
            onPress={handleAskJarvis}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <Text style={styles.askButtonText}>💡 Demander à Jarvis de vous aider</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.historyTitle}>📄 Historique des notes</Text>
        {notes.length === 0 ? (
          <Text style={styles.emptyText}>Aucune note enregistrée.</Text>
        ) : (
          notes.map((note) => (
            <View key={note.id} style={styles.noteCard}>
              <Text style={styles.noteDate}>{note.date}</Text>
              <Text style={styles.noteText}>{note.text}</Text>
              {note.response && (
                <View style={styles.responseBox}>
                  <Text style={styles.responseLabel}>🤖 Jarvis :</Text>
                  <Text style={styles.responseText}>{note.response}</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => deleteNote(note.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* BOUTON JARVIS EN BAS */}
        <View style={styles.jarvisSection}>
          <TouchableOpacity style={styles.jarvisButton}>
            <Text style={styles.jarvisButtonText}>✨ Jarvis — Que veux-tu faire ?</Text>
          </TouchableOpacity>
          <View style={styles.optionsRow}>
            <TouchableOpacity style={styles.optionChip} onPress={() => handleJarvisAction("Résumer")}>
              <Text style={styles.optionChipText}>Résumer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionChip} onPress={() => handleJarvisAction("Corriger")}>
              <Text style={styles.optionChipText}>Corriger</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionChip} onPress={() => handleJarvisAction("Développer")}>
              <Text style={styles.optionChipText}>Développer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionChip} onPress={() => handleJarvisAction("Traduire")}>
              <Text style={styles.optionChipText}>Traduire</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionChip} onPress={() => handleJarvisAction("Expliquer")}>
              <Text style={styles.optionChipText}>Expliquer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    color: '#E5E5E5',
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  inputCard: {
    backgroundColor: '#141414',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 20,
  },
  label: {
    color: '#E5E5E5',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    color: '#F5F5F5',
    fontSize: 14,
    minHeight: 120,
    marginBottom: 12,
  },
  askButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  askButtonDisabled: {
    opacity: 0.6,
  },
  askButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
  },
  historyTitle: {
    color: '#E5E5E5',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    color: '#6B6B6B',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  noteCard: {
    backgroundColor: '#141414',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 10,
  },
  noteDate: {
    color: '#6B6B6B',
    fontSize: 11,
    marginBottom: 4,
  },
  noteText: {
    color: '#E5E5E5',
    fontSize: 14,
    marginBottom: 6,
  },
  responseBox: {
    backgroundColor: '#1A1A1A',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  responseLabel: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  responseText: {
    color: '#A8A8A8',
    fontSize: 13,
    lineHeight: 18,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: 6,
    padding: 4,
  },
  jarvisSection: {
    marginTop: 20,
    paddingBottom: 20,
  },
  jarvisButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  jarvisButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  optionChip: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  optionChipText: {
    color: '#E5E5E5',
    fontSize: 13,
    fontWeight: '500',
  },
});