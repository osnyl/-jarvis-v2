import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function SecurityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  const securityItems = [
    { icon: 'lock-closed-outline', title: 'Authentification', text: 'Google Sign-In · Compte securise' },
    { icon: 'folder-outline', title: 'Donnees personnelles', text: 'Stockees localement sur votre appareil' },
    { icon: 'shield-checkmark-outline', title: 'Chiffrement', text: 'Vos donnees sont chiffrees' },
    { icon: 'time-outline', title: 'Derniere connexion', text: lastLogin },
    { icon: 'phone-portrait-outline', title: 'Appareils connectes', text: 'Redmi 14C (actuel)' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Securite</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {securityItems.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <Ionicons name={item.icon as any} size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
            <Text style={styles.cardText}>{item.text}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/settings')} activeOpacity={0.8}>
          <Ionicons name="settings-outline" size={18} color="#FFFFFF" />
          <Text style={styles.settingsText}>Gerer dans Parametres</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    paddingBottom: 12,
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
    fontSize: 18,
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
  card: {
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  cardText: {
    color: '#888888',
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: 44,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1A1A1A',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginTop: 8,
  },
  settingsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});