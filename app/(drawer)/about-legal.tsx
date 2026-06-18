import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutLegalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#E5E5E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mentions légales</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningCard}>
          <Ionicons name="warning-outline" size={18} color="#FFD700" />
          <Text style={styles.warningText}>
            Ce projet est un prototype étudiant. Toute utilisation est sous la responsabilité de l'utilisateur.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Propriété intellectuelle</Text>
          <Text style={styles.sectionText}>
            L'application Jarvis, son code source, son design et son contenu
            sont la propriété exclusive de la startup Noelie et de son
            développeur Osnyl. Toute reproduction non autorisée, totale ou
            partielle, est strictement interdite.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Protection des données</Text>
          <Text style={styles.sectionText}>
            Vos conversations avec Jarvis sont stockées localement sur votre
            appareil. Aucune donnée personnelle n'est vendue ou partagée avec
            des tiers. Les échanges avec le serveur sont protégés par une clé
            d'authentification sécurisée.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Limitation de responsabilité</Text>
          <Text style={styles.sectionText}>
            Jarvis fournit des informations à titre indicatif grâce à
            l'intelligence artificielle. Bien que nous nous efforcions
            d'assurer la fiabilité des réponses, l'application ne saurait être
            tenue responsable d'éventuelles erreurs ou décisions prises sur la
            base des réponses fournies.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disponibilité du service</Text>
          <Text style={styles.sectionText}>
            Le service peut être temporairement indisponible pour des raisons
            de maintenance ou de mise à jour. Nous nous efforçons de
            maintenir une disponibilité maximale.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.sectionText}>
            Pour toute question relative à ces mentions légales, vous pouvez
            contacter le développeur à l'adresse suivante :
          </Text>
          <Text style={styles.contactEmail}>sossoubiadjacharbel@gmail.com</Text>
        </View>

        <TouchableOpacity style={styles.acknowledgeButton}>
          <Text style={styles.acknowledgeText}>J'ai pris connaissance des mentions légales</Text>
        </TouchableOpacity>

        <Text style={styles.dateText}>Dernière mise à jour : Juin 2026</Text>
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
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#141414',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  warningText: { color: '#A8A8A8', fontSize: 13, flex: 1, lineHeight: 18 },
  section: {
    marginBottom: 16,
  },
  sectionTitle: { color: '#F5F5F5', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  sectionText: { color: '#A8A8A8', fontSize: 13, lineHeight: 20 },
  contactEmail: { color: '#FFD700', fontSize: 13, marginTop: 4 },
  acknowledgeButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  acknowledgeText: { color: '#FFD700', fontSize: 14, fontWeight: '600' },
  dateText: {
    color: '#4A4A4A',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
  },
});