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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerToggleButton } from 'expo-router/drawer';

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

  const insets = useSafeAreaInsets();

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
    setConfirmMessage('Rappel enregistre. Jarvis veille sur vous.');
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
      { text: 'Supprimer', style: 'destructive', onPress: () => {
        const updated = reminders.filter((r) => r.id !== id);
        saveReminders(updated);
      }},
    ]);
  };

  const doneCount = reminders.filter((r) => r.done).length;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <View style={styles.drawerButton}>
            <DrawerToggleButton tintColor="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>Rappels</Text>
          <View style={styles.drawerButton} />
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <View style={styles.addButtonLeft}>
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Programmer un rappel</Text>
        </View>
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>
          Un bon planning est la cle de la reussite. Que voulez-vous programmer aujourd'hui ?
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
              <Text style={styles.cardDate}>{item.date} a {item.time}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => toggleDone(item.id)} style={styles.actionButton}>
                  <Ionicons 
                    name={item.done ? "refresh-outline" : "checkmark"} 
                    size={20} 
                    color={item.done ? "#888888" : "#4CAF50"} 
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteReminder(item.id)} style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={20} color="#FF4444" />
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

      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <Text style={styles.footerText}>
          {reminders.length} rappel{reminders.length > 1 && 's'} ({doneCount} fait{doneCount > 1 && 's'}, {reminders.length - doneCount} a faire)
        </Text>
      </View>

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
              placeholderTextColor="#666666"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Details du rappel..."
              placeholderTextColor="#666666"
              multiline
            />

            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="JJ/MM/AAAA"
              placeholderTextColor="#666666"
            />

            <Text style={styles.label}>Heure</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="HH:MM"
              placeholderTextColor="#666666"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={addReminder}
              >
                <Text style={styles.modalButtonTextSave}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000' 
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
    justifyContent: 'space-between',
  },
  drawerButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 2,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111111',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  addButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addButtonText: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: '500' 
  },
  welcomeCard: {
    backgroundColor: '#111111',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  welcomeText: { 
    color: '#888888', 
    fontSize: 14, 
    lineHeight: 20, 
    textAlign: 'center' 
  },
  list: { 
    flex: 1, 
    marginTop: 16, 
    paddingHorizontal: 16 
  },
  emptyText: { 
    color: '#555555', 
    fontSize: 14, 
    textAlign: 'center', 
    marginTop: 40 
  },
  card: {
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  cardDone: { 
    opacity: 0.4 
  },
  cardName: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: '600' 
  },
  cardNameDone: { 
    textDecorationLine: 'line-through',
    color: '#666666'
  },
  cardDescription: { 
    color: '#888888', 
    fontSize: 13, 
    marginTop: 4 
  },
  cardDate: { 
    color: '#555555', 
    fontSize: 12, 
    marginTop: 8,
    fontWeight: '500'
  },
  cardActions: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 16, 
    marginTop: 12 
  },
  actionButton: { 
    padding: 4 
  },
  confirmCard: {
    backgroundColor: '#0A1A0A',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1A3A1A',
  },
  confirmText: { 
    color: '#4CAF50', 
    fontSize: 13, 
    textAlign: 'center',
    fontWeight: '500'
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  footerText: { 
    color: '#444444', 
    fontSize: 12 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#111111',
    width: '90%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: { 
    color: '#888888', 
    fontSize: 13, 
    marginBottom: 6,
    fontWeight: '500'
  },
  input: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 10,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 14,
  },
  textArea: { 
    minHeight: 60, 
    textAlignVertical: 'top' 
  },
  modalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 12, 
    marginTop: 8 
  },
  modalButton: { 
    flex: 1, 
    padding: 14, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  modalButtonCancel: { 
    backgroundColor: '#1A1A1A' 
  },
  modalButtonSave: { 
    backgroundColor: '#FFFFFF' 
  },
  modalButtonTextCancel: { 
    color: '#FFFFFF', 
    fontWeight: '600', 
    fontSize: 14 
  },
  modalButtonTextSave: { 
    color: '#000000', 
    fontWeight: '600', 
    fontSize: 14 
  },
});