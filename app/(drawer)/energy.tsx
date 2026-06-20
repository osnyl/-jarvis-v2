import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EnergyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delesteur</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flash-outline" size={18} color="#FFFFFF" />
            <Text style={styles.cardTitle}>Puissance actuelle</Text>
          </View>
          <Text style={styles.cardValue}>-- W</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '0%' }]} />
          </View>
          <Text style={styles.cardSub}>Seuil max : 2500 W</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="thermometer-outline" size={18} color="#FFFFFF" />
            <Text style={styles.cardTitle}>Temperature</Text>
          </View>
          <Text style={styles.cardValue}>-- C</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="toggle-outline" size={18} color="#FFFFFF" />
            <Text style={styles.cardTitle}>Etat des relais</Text>
          </View>
          {[1, 2, 3, 4].map((index) => (
            <View key={index} style={styles.relayRow}>
              <Text style={styles.relayLabel}>Relais {index}</Text>
              <View style={[styles.relayStatus, styles.relayOff]}>
                <Text style={styles.relayStatusText}>OFF</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.waitingCard}>
          <View style={styles.waitingIconBox}>
            <Ionicons name="sync-outline" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.waitingText}>En attente de connexion</Text>
          <Text style={styles.waitingSub}>Les donnees s'afficheront automatiquement</Text>
        </View>

        <TouchableOpacity style={styles.emergencyButton} activeOpacity={0.8}>
          <Ionicons name="alert-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.emergencyText}>Arret d'urgence</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    color: '#FFFFFF', 
    fontSize: 17, 
    fontWeight: '700',
    letterSpacing: 1,
  },
  scrollView: { 
    flex: 1 
  },
  content: { 
    padding: 16, 
    paddingBottom: 40 
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
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: { 
    color: '#888888', 
    fontSize: 14, 
    fontWeight: '500'
  },
  cardValue: { 
    color: '#FFFFFF', 
    fontSize: 32, 
    fontWeight: '700' 
  },
  cardSub: { 
    color: '#555555', 
    fontSize: 12, 
    marginTop: 4 
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  relayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  relayLabel: { 
    color: '#FFFFFF', 
    fontSize: 14 
  },
  relayStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  relayOff: { 
    backgroundColor: '#1A1111',
    borderWidth: 1,
    borderColor: '#2A1A1A',
  },
  relayStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  waitingCard: {
    alignItems: 'center',
    backgroundColor: '#111111',
    padding: 24,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderStyle: 'dashed',
  },
  waitingIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  waitingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  waitingSub: {
    color: '#555555',
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
  emergencyText: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: '600' 
  },
});