import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  const router = useRouter();

  const aboutItems = [
    { icon: 'sparkles-outline', label: "C'est qui Jarvis ?", route: '/about-jarvis' },
    { icon: 'person-circle-outline', label: 'Identité du développeur', route: '/about-developer' },
    { icon: 'logo-github', label: 'GitHub', route: '/about-github' },
    { icon: 'document-text-outline', label: 'Mention légale', route: '/about-legal' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* HEADER AVEC BOUTON RETOUR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.logoCircle}>
          <Ionicons name="sparkles" size={32} color="#FFD700" />
        </View>
        <Text style={styles.headerTitle}>JARVIS</Text>
        <Text style={styles.headerSubtitle}>Votre assistant IA personnel</Text>
      </View>

      <View style={styles.card}>
        {aboutItems.map((item, idx) => (
          <React.Fragment key={idx}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.6}
            >
              <View style={styles.itemLeft}>
                <Ionicons name={item.icon as any} size={20} color="#FFD700" />
                <Text style={styles.itemText}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
            </TouchableOpacity>
            {idx < aboutItems.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>© 2026 Osnyl – Tous droits réservés.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 32,
    zIndex: 10,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    marginBottom: 12,
  },
  headerTitle: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  headerSubtitle: {
    color: '#A8A8A8',
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#141414',
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  itemText: {
    color: '#E5E5E5',
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#1F1F1F',
    marginLeft: 52,
  },
  footer: {
    marginTop: 28,
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    color: '#6B6B6B',
    fontSize: 12,
  },
});