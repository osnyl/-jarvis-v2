import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutAppScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header avec bouton retour */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>En savoir plus</Text>
        
        {/* View vide pour centrer le titre */}
        <View style={styles.backButton} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discuter avec Jarvis</Text>
          <Text style={styles.text}>
            Posez vos questions, obtenez des réponses, échangez avec l'IA. Jarvis est là pour vous aider, vous conseiller et vous accompagner dans vos réflexions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contrôler votre dépense énergétique</Text>
          <Text style={styles.text}>
            Suivez votre consommation en temps réel, gérez vos relais, et recevez des conseils pour économiser l'énergie. Le délesteur intelligent coupe automatiquement les charges non prioritaires en cas de surcharge.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rappels</Text>
          <Text style={styles.text}>
            Programmez des rappels pour ne rien oublier. Jarvis vous alertera au bon moment.
          </Text>
        </View>

        <View style={[styles.section, styles.warningSection]}>
          <Text style={[styles.sectionTitle, styles.warningTitle]}>Projet étudiant</Text>
          <Text style={styles.text}>
            Jarvis est actuellement en phase de développement (version étudiante). Certaines fonctionnalités sont encore en construction. Toute contribution ou retour est le bienvenu.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#000000',
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
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  warningSection: {
    borderBottomWidth: 0,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  warningTitle: {
    color: '#FFD700',
  },
  text: {
    color: '#888888',
    fontSize: 14,
    lineHeight: 22,
  },
});