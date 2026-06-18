import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function SecurityScreen() {
  const router = useRouter();
  const [lastLogin, setLastLogin] = useState<string>('Chargement...');

  useEffect(() => {
    const loadLastLogin = async () => {
      try {
        const stored = await AsyncStorage.getItem('lastLogin');
        if (stored) {
          setLastLogin(stored);
        } else {
          setLastLogin('Aujourd\'hui, ' + new Date().toLocaleTimeString());
        }
      } catch (e) {
        setLastLogin('Inconnue');
      }
    };
    loadLastLogin();
  }, []);

  return (
    <View style={styles.container}>
      {/* HEADER FIXE */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sécurité</Text>
      </View>

      {/* CONTENU DÉFILABLE */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔐 Authentification</Text>
          <Text style={styles.cardText}>Google Sign-In · Compte sécurisé</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📁 Données personnelles</Text>
          <Text style={styles.cardText}>Stockées localement sur votre appareil</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔒 Chiffrement</Text>
          <Text style={styles.cardText}>Vos données sont chiffrées</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🕒 Dernière connexion</Text>
          <Text style={styles.cardText}>{lastLogin}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📱 Appareils connectés</Text>
          <Text style={styles.cardText}>Redmi 14C (actuel)</Text>
        </View>

        <TouchableOpacity style={styles.logoutCard} onPress={() => router.push('/settings')}>
          <Text style={styles.logoutText}>⚙️ Gérer dans Paramètres</Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: '#141414',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardTitle: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardText: {
    color: '#A8A8A8',
    fontSize: 14,
    lineHeight: 20,
  },
  logoutCard: {
    backgroundColor: '#1A1212',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A2020',
    marginTop: 8,
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
});