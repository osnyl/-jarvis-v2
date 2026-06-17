import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>ℹ️</Text>
        <Text style={styles.headerTitle}>À propos</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.appName}>JARVIS</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.description}>
          Jarvis est plus qu'un simple assistant personnel : c'est un proche, un compagnon intelligent qui vous permet de vous ressourcer, de trouver des réponses à vos questions sur vos activités, et d'accompagner vos enfants dans leurs projets d'étude.
        </Text>
        <Text style={styles.description}>
          Développé par Osnyl, dans une vision d'aide pour l'Afrique, principalement le Bénin, Jarvis s'adresse à tous : parents, étudiants, professionnels. Il vous accompagne dans la gestion de votre énergie, l'organisation de votre quotidien, et vous offre un soutien pédagogique et technologique.
        </Text>
        <Text style={styles.description}>
          Jarvis est né d'une conviction : la technologie doit être utile, accessible et humaine. Il est là pour vous écouter, vous conseiller et vous simplifier la vie, partout et pour tous.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Développé par</Text>
        <Text style={styles.developer}>Osnyl</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Liens</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/osnyl/jarvis-v2')}>
          <Text style={styles.link}>GitHub</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Mentions légales</Text>
        <Text style={styles.legal}>
          Jarvis Energy est un projet étudiant développé dans le cadre d'une formation en
          Électrotechnique.
        </Text>
        <Text style={styles.legal}>© 2026 Osnyl – Tous droits réservés.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  headerIcon: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 18,
    color: '#E5E5E5',
    fontWeight: 'bold',
    letterSpacing: 4,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#141414',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  appName: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 6,
  },
  version: {
    color: '#6B6B6B',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  description: {
    color: '#A8A8A8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  sectionTitle: {
    color: '#E5E5E5',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  developer: {
    color: '#F5F5F5',
    fontSize: 15,
  },
  link: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 6,
    textDecorationLine: 'underline',
  },
  legal: {
    color: '#6B6B6B',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
});