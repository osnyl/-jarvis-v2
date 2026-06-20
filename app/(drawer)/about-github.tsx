import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutGithubScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GitHub</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons name="logo-github" size={56} color="#FFFFFF" />
        </View>
        <Text style={styles.repoName}>osnyl/jarvis-v2</Text>
        <Text style={styles.repoDesc}>
          Code source de l'application Jarvis — Assistant IA personnel mobile
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://github.com/osnyl/-jarvis-v2')}
          activeOpacity={0.8}
        >
          <Ionicons name="open-outline" size={18} color="#000000" />
          <Text style={styles.buttonText}>Voir sur GitHub</Text>
        </TouchableOpacity>
      </View>
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
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 30 
  },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    marginBottom: 8,
  },
  repoName: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '700', 
    marginTop: 16,
    letterSpacing: 0.5,
  },
  repoDesc: { 
    color: '#888888', 
    fontSize: 14, 
    textAlign: 'center', 
    marginTop: 10, 
    lineHeight: 20,
    maxWidth: 280,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 32,
  },
  buttonText: { 
    color: '#000000', 
    fontWeight: '600', 
    fontSize: 15,
  },
});