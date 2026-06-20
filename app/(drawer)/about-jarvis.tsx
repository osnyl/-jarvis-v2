import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutJarvisScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>C'est qui Jarvis ?</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconHero}>
          <View style={styles.iconBox}>
            <Ionicons name="sparkles" size={40} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.lead}>
          Jarvis est plus qu'un simple assistant personnel : c'est un compagnon
          intelligent qui vous accompagne au quotidien.
        </Text>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.smallIconBox}>
              <Ionicons name="heart-outline" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.sectionTitle}>Notre mission</Text>
          </View>
          <Text style={styles.sectionText}>
            Permettre a chacun de se ressourcer, de trouver des reponses a ses
            questions du quotidien, et d'accompagner les enfants dans leurs
            projets d'etudes. Jarvis est concu pour etre un veritable allie,
            disponible a tout moment.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.smallIconBox}>
              <Ionicons name="earth-outline" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.sectionTitle}>Une vision pour l'Afrique</Text>
          </View>
          <Text style={styles.sectionText}>
            Developpe avec une vision d'aide pour l'Afrique, principalement le
            Benin, Jarvis s'adresse a tous : parents, etudiants, professionnels
            et entrepreneurs qui souhaitent gagner en efficacite au quotidien.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.smallIconBox}>
              <Ionicons name="flash-outline" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.sectionTitle}>Ce que Jarvis sait faire</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="chatbubbles-outline" size={16} color="#888888" />
            <Text style={styles.featureText}>Discuter et repondre a vos questions grace a l'IA</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="alarm-outline" size={16} color="#888888" />
            <Text style={styles.featureText}>Vous rappeler vos taches et rendez-vous importants</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="flash-outline" size={16} color="#888888" />
            <Text style={styles.featureText}>Surveiller et optimiser votre consommation d'energie</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#888888" />
            <Text style={styles.featureText}>Proteger vos donnees avec un systeme securise</Text>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.noteText}>
            Jarvis est un projet etudiant en evolution progressive. Il ne remplace pas les grands modeles d'IA, mais il a ete pense avec une vision claire : rendre la technologie accessible et utile pour l'Afrique, et particulierement pour le Benin.
          </Text>
        </View>

        <Text style={styles.quoteText}>
          "Un assistant qui comprend, qui aide, qui veille."
        </Text>
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
  iconHero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  lead: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 28,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  smallIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionText: {
    color: '#888888',
    fontSize: 14,
    lineHeight: 22,
    paddingLeft: 42,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 10,
    paddingLeft: 42,
  },
  featureText: {
    color: '#888888',
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  noteText: {
    color: '#888888',
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  quoteText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
});