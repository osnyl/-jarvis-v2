import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutDeveloperScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/about')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#E5E5E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Le développeur</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarBox}>
          <Ionicons name="person-circle" size={90} color="#FFD700" />
        </View>

        <Text style={styles.name}>Osnyl</Text>
        <Text style={styles.role}>Fondateur & Développeur — Startup Noelie</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={18} color="#FFD700" />
            <View>
              <Text style={styles.infoLabel}>Startup</Text>
              <Text style={styles.infoValue}>Noelie</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="code-slash-outline" size={18} color="#FFD700" />
            <View>
              <Text style={styles.infoLabel}>Développeur</Text>
              <Text style={styles.infoValue}>Osnyl 2.0</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => Linking.openURL('mailto:sossoubiadjacharbel@gmail.com')}
          >
            <Ionicons name="mail-outline" size={18} color="#FFD700" />
            <View>
              <Text style={styles.infoLabel}>Contact</Text>
              <Text style={styles.infoValueLink}>sossoubiadjacharbel@gmail.com</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bioCard}>
          <Text style={styles.bioTitle}>À propos de moi</Text>
          <Text style={styles.bioText}>
            Étudiant en L3 Électrotechnique à l'ENSET de Lokossa, passionné par
            l'intelligence artificielle et l'innovation technologique. Jarvis
            est né de l'envie de créer un assistant accessible et utile pour
            la vie quotidienne, en alliant développement mobile, IA et
            électrotechnique.
          </Text>
        </View>

        <View style={styles.thanksCard}>
          <Ionicons name="heart" size={16} color="#FF6B6B" />
          <Text style={styles.thanksText}>
            Merci à toutes celles et ceux qui ont accompagné ce projet, de
            près ou de loin.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  backButton: { marginRight: 12 },
  headerTitle: { color: '#F5F5F5', fontSize: 17, fontWeight: 'bold' },
  content: { padding: 20, alignItems: 'center', paddingBottom: 40 },
  avatarBox: { marginTop: 12, marginBottom: 16 },
  name: { color: '#F5F5F5', fontSize: 22, fontWeight: 'bold' },
  role: { color: '#A8A8A8', fontSize: 13, marginTop: 4, marginBottom: 24 },
  infoCard: {
    width: '100%',
    backgroundColor: '#141414',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  infoLabel: { color: '#6B6B6B', fontSize: 12 },
  infoValue: { color: '#E5E5E5', fontSize: 15, marginTop: 2 },
  infoValueLink: { color: '#FFD700', fontSize: 14, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#1F1F1F', marginLeft: 48 },
  bioCard: {
    width: '100%',
    backgroundColor: '#141414',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 18,
    marginTop: 16,
  },
  bioTitle: { color: '#FFD700', fontSize: 14, fontWeight: '700', marginBottom: 10 },
  bioText: { color: '#A8A8A8', fontSize: 14, lineHeight: 21 },
  thanksCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 12,
  },
  thanksText: { color: '#6B6B6B', fontSize: 12, flex: 1, textAlign: 'center' },
});