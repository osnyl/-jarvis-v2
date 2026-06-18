import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EnergyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚡ Délesteur</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Puissance actuelle</Text>
          <Text style={styles.cardValue}>-- W</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '0%' }]} />
          </View>
          <Text style={styles.cardSub}>Seuil max : 2500 W</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Température</Text>
          <Text style={styles.cardValue}>-- °C</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>État des relais</Text>
          {[1, 2, 3, 4].map((index) => (
            <View key={index} style={styles.relayRow}>
              <Text style={styles.relayLabel}>Relais {index}</Text>
              <View style={[styles.relayStatus, styles.relayOff]}>
                <Text style={styles.relayStatusText}>--</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.waitingCard}>
          <Ionicons name="sync-outline" size={28} color="#FFD700" />
          <Text style={styles.waitingText}>En attente de connexion au système</Text>
          <Text style={styles.waitingSub}>Les données s'afficheront automatiquement</Text>
        </View>

        <TouchableOpacity style={styles.emergencyButton}>
          <Ionicons name="alert-circle" size={24} color="#FFFFFF" />
          <Text style={styles.emergencyText}>⚠️ Arrêt d'urgence</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  backButton: { padding: 4, marginRight: 12 },
  headerTitle: { color: '#E5E5E5', fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },
  scrollView: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#141414',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardTitle: { color: '#A8A8A8', fontSize: 14, marginBottom: 4 },
  cardValue: { color: '#FFD700', fontSize: 32, fontWeight: 'bold' },
  cardSub: { color: '#6B6B6B', fontSize: 12, marginTop: 4 },
  progressBar: {
    height: 6,
    backgroundColor: '#2A2A2A',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  relayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  relayLabel: { color: '#E5E5E5', fontSize: 14 },
  relayStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  relayOn: { backgroundColor: '#1A3A1A' },
  relayOff: { backgroundColor: '#3A1A1A' },
  relayStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  waitingCard: {
    alignItems: 'center',
    backgroundColor: '#141414',
    padding: 24,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderStyle: 'dashed',
  },
  waitingText: {
    color: '#E5E5E5',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  waitingSub: {
    color: '#6B6B6B',
    fontSize: 13,
    marginTop: 4,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#CC3333',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  emergencyText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});