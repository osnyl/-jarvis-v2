import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutJarvisScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#E5E5E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>C'est qui Jarvis ?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconHero}>
          <Ionicons name="sparkles" size={48} color="#FFD700" />
        </View>

        <Text style={styles.lead}>
          Jarvis est plus qu'un simple assistant personnel : c'est un compagnon
          intelligent qui vous accompagne au quotidien.
        </Text>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="heart-outline" size={18} color="#FFD700" />
            <Text style={styles.sectionTitle}>Notre mission</Text>
          </View>
          <Text style={styles.sectionText}>
            Permettre à chacun de se ressourcer, de trouver des réponses à ses
            questions du quotidien, et d'accompagner les enfants dans leurs
            projets d'études. Jarvis est conçu pour être un véritable allié,
            disponible à tout moment.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="earth-outline" size={18} color="#FFD700" />
            <Text style={styles.sectionTitle}>Une vision pour l'Afrique</Text>
          </View>
          <Text style={styles.sectionText}>
            Développé avec une vision d'aide pour l'Afrique, principalement le
            Bénin, Jarvis s'adresse à tous : parents, étudiants, professionnels
            et entrepreneurs qui souhaitent gagner en efficacité au quotidien.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="flash-outline" size={18} color="#FFD700" />
            <Text style={styles.sectionTitle}>Ce que Jarvis sait faire</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="chatbubbles-outline" size={16} color="#A8A8A8" />
            <Text style={styles.featureText}>Discuter et répondre à vos questions grâce à l'IA</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="alarm-outline" size={16} color="#A8A8A8" />
            <Text style={styles.featureText}>Vous rappeler vos tâches et rendez-vous importants</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="flash-outline" size={16} color="#A8A8A8" />
            <Text style={styles.featureText}>Surveiller et optimiser votre consommation d'énergie</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#A8A8A8" />
            <Text style={styles.featureText}>Protéger vos données avec un système sécurisé</Text>
          </View>
        </View>

        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>
            "Un assistant qui comprend, qui aide, qui veille."
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
  content: { padding: 20, paddingBottom: 40 },
  iconHero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lead: {
    color: '#F5F5F5',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 28,
  },
  section: {
    backgroundColor: '#141414',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionText: {
    color: '#A8A8A8',
    fontSize: 14,
    lineHeight: 21,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 8,
  },
  featureText: {
    color: '#A8A8A8',
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  quoteBox: {
    marginTop: 8,
    padding: 18,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
    backgroundColor: '#141414',
    borderRadius: 8,
  },
  quoteText: {
    color: '#E5E5E5',
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});