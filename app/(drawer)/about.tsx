import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';

export default function AboutScreen() {
  const showJarvisDescription = () => {
    Alert.alert(
      'C’est qui Jarvis ?',
      'Jarvis est plus qu’un simple assistant personnel : c’est un proche, un compagnon intelligent qui vous permet de vous ressourcer, de trouver des réponses à vos questions sur vos activités, et d’accompagner vos enfants dans leurs projets d’étude. Développé dans une vision d’aide pour l’Afrique, principalement le Bénin, Jarvis s’adresse à tous : parents, étudiants, professionnels.',
      [{ text: 'OK' }]
    );
  };

  const showDeveloperIdentity = () => {
    Alert.alert(
      'Identité du développeur',
      'Nom du Startup : Noelie\nNom du développeur : Osnyl 2.0\nContact : sossoubiadjacharbel@gmail.com',
      [{ text: 'OK' }]
    );
  };

  const showLegalMention = () => {
    Alert.alert(
      '⚠️ Mention légale',
      'Attention, ce projet est le seul que j’ai. Si tu le casses, je pleure.\n\nJarvis a été développé avec amour (et beaucoup de café) par Osnyl.\n\nToute reproduction, vol ou utilisation malveillante est interdite, sauf si tu m’invites à manger. 😄',
      [{ text: 'Je promets de ne pas casser', style: 'default' }]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item} onPress={showJarvisDescription}>
        <Text style={styles.itemText}>C’est qui Jarvis ?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={showDeveloperIdentity}>
        <Text style={styles.itemText}>Identité du développeur</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('https://github.com/osnyl/jarvis-v2')}>
        <Text style={styles.itemText}>GitHub</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={showLegalMention}>
        <Text style={styles.itemText}>Mention légale</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>© 2026 Osnyl – Tous droits réservés.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingTop: 8,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1F1F1F',
  },
  itemText: {
    color: '#E5E5E5',
    fontSize: 16,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    color: '#6B6B6B',
    fontSize: 12,
  },
});