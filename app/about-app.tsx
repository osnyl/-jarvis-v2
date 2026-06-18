import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function AboutAppScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Bouton retour */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>📱 En savoir plus</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💬 Discuter avec Jarvis</Text>
        <Text style={styles.text}>
          Posez vos questions, obtenez des réponses, échangez avec l’IA. Jarvis est là pour vous aider, vous conseiller et vous accompagner dans vos réflexions.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>⚡ Contrôler votre dépense énergétique</Text>
        <Text style={styles.text}>
          Suivez votre consommation en temps réel, gérez vos relais, et recevez des conseils pour économiser l’énergie. Le délesteur intelligent coupe automatiquement les charges non prioritaires en cas de surcharge.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🔔 Rappels</Text>
        <Text style={styles.text}>
          Programmez des rappels pour ne rien oublier. Jarvis vous alertera au bon moment.
        </Text>
      </View>

      <View style={[styles.card, styles.warningCard]}>
        <Text style={styles.sectionTitle}>⚠️ Projet étudiant</Text>
        <Text style={styles.text}>
          Jarvis est actuellement en phase de développement (version étudiante). Certaines fonctionnalités sont encore en construction. Toute contribution ou retour est le bienvenu.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  backText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  card: {
    backgroundColor: '#141414',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  warningCard: {
    borderColor: '#FFD70055',
    backgroundColor: '#1A1A0A',
  },
  sectionTitle: {
    color: '#E5E5E5',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  text: {
    color: '#A8A8A8',
    fontSize: 14,
    lineHeight: 20,
  },
});