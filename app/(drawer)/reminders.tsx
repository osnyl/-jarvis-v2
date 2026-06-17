import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';

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

  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReminders(JSON.parse(stored));
      }
    } catch (e) {}
  };

  // Recharge les rappels chaque fois qu'on revient sur cet écran
  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, [])
  );

  const saveReminders = async (newReminders: Reminder[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newReminders));
      setReminders(newReminders);
    } catch (e) {}
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
      {
        text: 'Supprimer',
        onPress: () => {
          const updated = reminders.filter((r) => r.id !== id);
          saveReminders(updated);
        },
      },
    ]);
  };

  const doneCount = reminders.filter((r) => r.done).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🔔</Text>
        <Text style={styles.headerTitle}>Rappels</Text>
      </View>

      {/* Bouton Programmer un rappel - navigue vers nouvel écran */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(drawer)/add-reminder')}
      >
        <Text style={styles.addButtonText}>📝 Programmer un rappel</Text>
        <Text style={styles.addButtonIcon}>＋</Text>
      </TouchableOpacity>

      {/* Phrase d'accueil */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>
          Un bon planning est la clé de la réussite. Que voulez-vous programmer aujourd'hui ?
        </Text>
      </View>

      {/* Liste des rappels */}
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

      {/* Résumé */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {reminders.length} rappel{reminders.length > 1 && 's'} ({doneCount} fait{doneCount > 1 && 's'}, {reminders.length - doneCount} à faire)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  headerIcon: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 18,
    color: '#E5E5E5',
    fontWeight: 'bold',
    letterSpacing: 4,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  addButtonText: {
    color: '#E5E5E5',
    fontSize: 16,
    fontWeight: '500',
  },
  addButtonIcon: {
    color: '#E5E5E5',
    fontSize: 24,
    fontWeight: '300',
  },
  welcomeCard: {
    backgroundColor: '#141414',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  welcomeText: {
    color: '#A8A8A8',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  list: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  emptyText: {
    color: '#6B6B6B',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#141414',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardDone: {
    opacity: 0.5,
  },
  cardName: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardNameDone: {
    textDecorationLine: 'line-through',
  },
  cardDescription: {
    color: '#A8A8A8',
    fontSize: 14,
    marginTop: 4,
  },
  cardDate: {
    color: '#6B6B6B',
    fontSize: 12,
    marginTop: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 8,
  },
  actionButton: {
    padding: 6,
  },
  actionText: {
    fontSize: 18,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#1F1F1F',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  footerText: {
    color: '#6B6B6B',
    fontSize: 12,
  },
});