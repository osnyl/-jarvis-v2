import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          onPress: async () => {
            try {
              await auth().signOut();
              await AsyncStorage.clear();
              router.replace('/login');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de se déconnecter.');
            }
          },
        },
      ]
    );
  };

  const showComingSoon = (title: string) => {
    Alert.alert(title, 'Cette fonctionnalité sera disponible prochainement.');
  };

  const navigateTo = (screen: string) => {
    router.push(screen);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Paramètres</Text>
      </View>

      {/* Section Aller à */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aller à</Text>
        <TouchableOpacity style={styles.item} onPress={() => navigateTo('/home')}>
          <Text style={styles.itemText}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => navigateTo('/energy')}>
          <Text style={styles.itemText}>Délesteur</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.item} onPress={() => showComingSoon('Choisir le mode')}>
        <Text style={styles.itemText}>Choisir le mode</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => showComingSoon('Notifications')}>
        <Text style={styles.itemText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => showComingSoon('Crédit consommé')}>
        <Text style={styles.itemText}>Crédit consommé</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => showComingSoon('Notifications sécurisées')}>
        <Text style={styles.itemText}>Notifications sécurisées</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => showComingSoon('Langue')}>
        <Text style={styles.itemText}>Langue</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => showComingSoon('Confidentialité')}>
        <Text style={styles.itemText}>Confidentialité</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, styles.logoutItem]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    color: '#E5E5E5',
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#6B6B6B',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1F1F1F',
  },
  itemText: {
    color: '#E5E5E5',
    fontSize: 16,
  },
  logoutItem: {
    marginTop: 8,
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#6B6B6B',
    fontSize: 12,
  },
});