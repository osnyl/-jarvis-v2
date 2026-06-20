import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutDeveloperScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Le developpeur</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarBox}>
          <Ionicons name="person-circle" size={80} color="#FFFFFF" />
        </View>

        <Text style={styles.name}>Osnyl</Text>
        <Text style={styles.role}>Fondateur & Developpeur — Startup Noelie</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="business-outline" size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Startup</Text>
              <Text style={styles.infoValue}>Noelie</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="code-slash-outline" size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Developpeur</Text>
              <Text style={styles.infoValue}>Osnyl 2.0</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => Linking.openURL('mailto:sossoubiadjacharbel@gmail.com')}
            activeOpacity={0.7}
          >
            <View style={styles.iconBox}>
              <Ionicons name="mail-outline" size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Contact</Text>
              <Text style={styles.infoValueLink}>sossoubiadjacharbel@gmail.com</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bioCard}>
          <Text style={styles.bioTitle}>A propos de moi</Text>
          <Text style={styles.bioText}>
            Etudiant en L2 Electrotechnique a l'ENSET de Lokossa, passionne par
            l'intelligence artificielle et l'innovation technologique. Jarvis
            est ne de l'envie de creer un assistant accessible et utile pour
            la vie quotidienne, en alliant developpement mobile, IA et
            electrotechnique et ce projet deviendra grand.
          </Text>
        </View>

        <View style={styles.thanksCard}>
          <Ionicons name="heart" size={14} color="#FF4444" />
          <Text style={styles.thanksText}>
            Merci a toutes celles et ceux qui ont accompagne ce projet, de
            pres ou de loin.
          </Text>
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
    padding: 20, 
    alignItems: 'center', 
    paddingBottom: 40 
  },
  avatarBox: { 
    marginTop: 12, 
    marginBottom: 16 
  },
  name: { 
    color: '#FFFFFF', 
    fontSize: 22, 
    fontWeight: '700' 
  },
  role: { 
    color: '#888888', 
    fontSize: 13, 
    marginTop: 4, 
    marginBottom: 24 
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#111111',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  infoLabel: { 
    color: '#666666', 
    fontSize: 12,
    fontWeight: '500',
  },
  infoValue: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    marginTop: 2,
    fontWeight: '500',
  },
  infoValueLink: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    marginTop: 2,
    textDecorationLine: 'underline',
  },
  divider: { 
    height: 1, 
    backgroundColor: '#1A1A1A', 
    marginLeft: 66 
  },
  bioCard: {
    width: '100%',
    backgroundColor: '#111111',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    padding: 18,
    marginTop: 16,
  },
  bioTitle: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: '700', 
    marginBottom: 10 
  },
  bioText: { 
    color: '#888888', 
    fontSize: 14, 
    lineHeight: 22 
  },
  thanksCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 12,
  },
  thanksText: { 
    color: '#555555', 
    fontSize: 12, 
    flex: 1, 
    textAlign: 'center',
    lineHeight: 18,
  },
});