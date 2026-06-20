import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutLegalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const sections = [
    {
      title: 'Propriete intellectuelle',
      text: "L'application Jarvis, son code source, son design et son contenu sont la propriete exclusive de la startup Noelie et de son developpeur Osnyl. Toute reproduction non autorisee, totale ou partielle, est strictement interdite.",
    },
    {
      title: 'Protection des donnees',
      text: "Vos conversations avec Jarvis sont stockees localement sur votre appareil. Aucune donnee personnelle n'est vendue ou partagee avec des tiers. Les echanges avec le serveur sont proteges par une cle d'authentification securisee.",
    },
    {
      title: 'Limitation de responsabilite',
      text: "Jarvis fournit des informations a titre indicatif grace a l'intelligence artificielle. Bien que nous nous efforcions d'assurer la fiabilite des reponses, l'application ne saurait etre tenue responsable d'eventuelles erreurs ou decisions prises sur la base des reponses fournies.",
    },
    {
      title: 'Disponibilite du service',
      text: "Le service peut etre temporairement indisponible pour des raisons de maintenance ou de mise a jour. Nous nous efforcons de maintenir une disponibilite maximale.",
    },
    {
      title: 'Contact',
      text: "Pour toute question relative a ces mentions legales, vous pouvez contacter le developpeur a l'adresse suivante :",
      email: 'sossoubiadjacharbel@gmail.com',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mentions legales</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningCard}>
          <View style={styles.warningIconBox}>
            <Ionicons name="alert-circle-outline" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.warningText}>
            Ce projet est un prototype etudiant. Toute utilisation est sous la responsabilite de l'utilisateur.
          </Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionNumberBox}>
                <Text style={styles.sectionNumber}>{String(index + 1).padStart(2, '0')}</Text>
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionText}>{section.text}</Text>
            {section.email && (
              <Text style={styles.emailText}>{section.email}</Text>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.acknowledgeButton} activeOpacity={0.8}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#000000" />
          <Text style={styles.acknowledgeText}>J'ai pris connaissance</Text>
        </TouchableOpacity>

        <Text style={styles.dateText}>Derniere mise a jour : Juin 2026</Text>
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
    letterSpacing: 0.5,
  },
  content: { 
    padding: 20, 
    paddingBottom: 40 
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  warningIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  warningText: { 
    color: '#888888', 
    fontSize: 13, 
    flex: 1, 
    lineHeight: 20 
  },
  section: {
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  sectionNumberBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  sectionNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: '700' 
  },
  sectionText: { 
    color: '#888888', 
    fontSize: 14, 
    lineHeight: 22,
    paddingLeft: 38,
  },
  emailText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 6,
    paddingLeft: 38,
    textDecorationLine: 'underline',
  },
  acknowledgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  acknowledgeText: { 
    color: '#000000', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  dateText: {
    color: '#444444',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});