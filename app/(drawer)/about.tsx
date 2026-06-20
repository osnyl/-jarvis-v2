import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const aboutItems = [
    { icon: 'sparkles-outline', label: "C'est qui Jarvis ?", route: '/about-jarvis' },
    { icon: 'person-circle-outline', label: 'Identite du developpeur', route: '/about-developer' },
    { icon: 'logo-github', label: 'GitHub', route: '/about-github' },
    { icon: 'document-text-outline', label: 'Mention legale', route: '/about-legal' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>A propos</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Ionicons name="sparkles" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>JARVIS</Text>
          <Text style={styles.heroSubtitle}>Votre assistant IA personnel</Text>
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
                  <View style={styles.iconBox}>
                    <Ionicons name={item.icon as any} size={18} color="#FFFFFF" />
                  </View>
                  <Text style={styles.itemText}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#555555" />
              </TouchableOpacity>
              {idx < aboutItems.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>2026 Osnyl  Tous droits reserves.</Text>
        </View>
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
  content: { 
    paddingBottom: 40 
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    marginBottom: 12,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 4,
  },
  heroSubtitle: {
    color: '#888888',
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#111111',
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1A1A1A',
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
  itemText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#1A1A1A',
    marginLeft: 62,
  },
  footer: {
    marginTop: 28,
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    color: '#444444',
    fontSize: 12,
  },
});