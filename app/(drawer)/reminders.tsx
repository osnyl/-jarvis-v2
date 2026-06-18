import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'reminders';

interface Reminder {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  done: boolean;
}

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setReminders(JSON.parse(stored));
    } catch (e) {}
  };

  const saveReminders = async (newReminders: Reminder[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newReminders));
      setReminders(newReminders);
    } catch (e) {}
  };

  const addReminder = () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un nom pour le rappel.');
      return;
    }
    const newReminder: Reminder = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim() || 'Aucune description',
      date: date.trim() || 'Aujourd\'hui',
      time: time.trim() || '12:00',
      done: false,
    };
    const updated = [...reminders, newReminder];
    saveReminders(updated);
    setModalVisible(false);
    setName('');
    setDescription('');
    setDate('');
    setTime('');
    setConfirmMessage('N\'oubliez plus rien ! Jarvis veille sur vous. 😉');
    setTimeout(() => setConfirmMessage(''), 4000);
  };

  const toggleDone = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, done: !r.done } : r
    );
    saveReminders(updated);
  };

  const deleteReminder = (id: string) => {
    Alert.alert('Supprimer', 'Voulez-vous vraiment supprimer ce rappel ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', onPress: () => {
        const updated = reminders.filter((r) => r.id !== id);
        saveReminders(updated);
      }},
    ]);
  };

  const doneCount = reminders.filter((r) => r.done).length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* En‑tête sans icône */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rappels</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>📝 Programmer un rappel</Text>
        <Text style={styles.addButtonIcon}>＋</Text>
      </TouchableOpacity>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>
          Un bon planning est la clé de la réussite. Que voulez-vous programmer aujourd'hui ?
        </Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 20 }}>
        {reminders.length === 0 ? (
          <Text style={styles.emptyText}>Aucun rappel pour le moment.</Text>
        ) : (
          reminders.map((item) => (
            <View key={item.id} style={[styles.card, item.done && styles.cardDone]}>
              <Text style={[styles.cardName, item.done && styles.cardNameDone]}>{item.name}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <Text style={styles.cardDate}>📅 {item.date} à {item.time}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => toggleDone(item.id)} style={styles.actionButton}>
                  <Text style={styles.actionText}>{item.done ? '↩️' : '✅'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteReminder(item.id)} style={styles.actionButton}>
                  <Text style={styles.actionText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {confirmMessage !== '' && (
        <View style={styles.confirmCard}>
          <Text style={styles.confirmText}>{confirmMessage}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {reminders.length} rappel{reminders.length > 1 && 's'} ({doneCount} fait{doneCount > 1 && 's'}, {reminders.length - doneCount} à faire)
        </Text>
      </View>

      {/* Modal corrigé */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.modalTitle}>Nouveau rappel</Text>

            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Acheter du lait"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Ex: Pense à prendre du lait..."
              placeholderTextColor="#666"
              multiline
            />

            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="JJ/MM/AAAA"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Heure</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="HH:MM"
              placeholderTextColor="#666"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={addReminder}
              >
                <Text style={styles.modalButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  headerTitle: {
    fontSize: 18,
    color: '#E5E5E5',
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  addButtonText: { color: '#E5E5E5', fontSize: 15, fontWeight: '500' },
  addButtonIcon: { color: '#E5E5E5', fontSize: 22, fontWeight: '300' },
  welcomeCard: {
    backgroundColor: '#141414',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  welcomeText: { color: '#A8A8A8', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  list: { flex: 1, marginTop: 12, paddingHorizontal: 16 },
  emptyText: { color: '#6B6B6B', fontSize: 14, textAlign: 'center', marginTop: 20 },
  card: {
    backgroundColor: '#141414',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardDone: { opacity: 0.5 },
  cardName: { color: '#F5F5F5', fontSize: 15, fontWeight: 'bold' },
  cardNameDone: { textDecorationLine: 'line-through' },
  cardDescription: { color: '#A8A8A8', fontSize: 13, marginTop: 2 },
  cardDate: { color: '#6B6B6B', fontSize: 12, marginTop: 6 },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 6 },
  actionButton: { padding: 4 },
  actionText: { fontSize: 16 },
  confirmCard: {
    backgroundColor: '#1A2A1A',
    marginHorizontal: 16,
    marginBottom: 6,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A4A2A',
  },
  confirmText: { color: '#A8E6A8', fontSize: 13, textAlign: 'center' },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#1F1F1F',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  footerText: { color: '#6B6B6B', fontSize: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    width: '90%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  modalTitle: {
    color: '#F5F5F5',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: { color: '#A8A8A8', fontSize: 13, marginBottom: 4 },
  input: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 8,
    padding: 10,
    color: '#F5F5F5',
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: { minHeight: 50, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 8 },
  modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  modalButtonCancel: { backgroundColor: '#2A2A2A' },
  modalButtonSave: { backgroundColor: '#FFD700' },
  modalButtonText: { color: '#000', fontWeight: '600', fontSize: 14 },
});