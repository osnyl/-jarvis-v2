import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEY = 'reminders';

interface Reminder {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  done: boolean;
}

export default function AddReminderScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const saveReminder = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un nom pour le rappel.');
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const reminders: Reminder[] = stored ? JSON.parse(stored) : [];

      const newReminder: Reminder = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim() || 'Aucune description',
        date: date.trim() || "Aujourd'hui",
        time: time.trim() || '12:00',
        done: false,
      };

      const updated = [...reminders, newReminder];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      router.back();
    } catch (e) {
      Alert.alert('Erreur', "Impossible d'enregistrer le rappel.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* HEADER FIXE */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#E5E5E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouveau rappel</Text>
      </View>

      {/* CONTENU DÉFILABLE */}
      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* BARRE FIXE EN BAS */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={saveReminder}>
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  backButton: { marginRight: 12 },
  headerTitle: { color: '#F5F5F5', fontSize: 18, fontWeight: 'bold' },
  form: { padding: 20, paddingBottom: 40 },
  label: { color: '#A8A8A8', fontSize: 14, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 10,
    padding: 14,
    color: '#F5F5F5',
    fontSize: 15,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1F1F1F',
    backgroundColor: '#0A0A0A',
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
  },
  cancelButtonText: { color: '#E5E5E5', fontWeight: '600', fontSize: 15 },
  saveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    alignItems: 'center',
  },
  saveButtonText: { color: '#0A0A0A', fontWeight: '700', fontSize: 15 },
});