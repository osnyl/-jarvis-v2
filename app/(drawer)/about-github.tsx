import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutGithubScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#E5E5E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GitHub</Text>
      </View>

      <View style={styles.content}>
        <Ionicons name="logo-github" size={64} color="#FFD700" />
        <Text style={styles.repoName}>osnyl/jarvis-v2</Text>
        <Text style={styles.repoDesc}>
          Code source de l'application Jarvis — Assistant IA personnel mobile
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://github.com/osnyl/-jarvis-v2')}
        >
          <Ionicons name="open-outline" size={18} color="#0A0A0A" />
          <Text style={styles.buttonText}>Voir sur GitHub</Text>
        </TouchableOpacity>
      </View>
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
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  repoName: { color: '#F5F5F5', fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  repoDesc: { color: '#A8A8A8', fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 19 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  buttonText: { color: '#0A0A0A', fontWeight: '700', fontSize: 14 },
});