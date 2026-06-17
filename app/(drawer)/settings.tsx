import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>⚙️</Text>
        <Text style={styles.headerTitle}>Paramètres</Text>
      </View>

      {/* Choisir le mode */}
      <TouchableOpacity style={styles.card} onPress={() => showComingSoon('Choisir le mode')}>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>🌗 Choisir le mode</Text>
            <Text style={styles.cardDescription}>Interface vide (message : "À venir")</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Notifications */}
      <TouchableOpacity style={styles.card} onPress={() => showComingSoon('Notifications')}>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>🔔 Notifications</Text>
            <Text style={styles.cardDescription}>Changer le mode de vos rappels</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Crédit consommé */}
      <TouchableOpacity style={styles.card} onPress={() => showComingSoon('Crédit consommé')}>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>💳 Crédit consommé</Text>
            <Text style={styles.cardDescription}>Interface vide (message : "À venir")</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Notifications sécurisées */}
      <TouchableOpacity style={styles.card} onPress={() => showComingSoon('Notifications sécurisées')}>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>🔔 Notifications sécurisées</Text>
            <Text style={styles.cardDescription}>Interface vide (message : "À venir")</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Langue */}
      <TouchableOpacity style={styles.card} onPress={() => showComingSoon('Langue')}>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>🌐 Langue</Text>
            <Text style={styles.cardDescription}>Actuel : Français</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Confidentialité */}
      <TouchableOpacity style={styles.card} onPress={() => showComingSoon('Confidentialité')}>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>🔒 Confidentialité</Text>
            <Text style={styles.cardDescription}>Gérer vos données personnelles</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Déconnexion */}
      <TouchableOpacity style={[styles.card, styles.logoutCard]} onPress={handleLogout}>
        <View style={styles.cardContent}>
          <View>
            <Text style={[styles.cardTitle, styles.logoutText]}>🚪 Déconnexion</Text>
            <Text style={styles.cardDescription}>Se déconnecter de votre compte</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Version */}
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
  card: {
    backgroundColor: '#141414',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  logoutCard: {
    borderColor: '#3A1A1A',
    backgroundColor: '#1A0A0A',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '500',
  },
  cardDescription: {
    color: '#6B6B6B',
    fontSize: 13,
    marginTop: 2,
  },
  logoutText: {
    color: '#FF6B6B',
  },
  arrow: {
    color: '#6B6B6B',
    fontSize: 24,
    fontWeight: '300',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#6B6B6B',
    fontSize: 12,
  },
});