import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';

export default function HelpScreen() {
  const showHelp = (title: string, content: string) => {
    Alert.alert(title, content, [{ text: 'OK' }]);
  };

  const contactSupport = () => {
    Linking.openURL('mailto:support@jarvis.com?subject=Aide Jarvis&body=Bonjour, j\'ai besoin d\'aide pour...');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>❓</Text>
        <Text style={styles.headerTitle}>Aide</Text>
      </View>

      {/* Guide rapide */}
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          showHelp(
            '💬 Comment utiliser Jarvis ?',
            '1. Connectez-vous avec Google.\n' +
            '2. Choisissez "Discuter avec Jarvis" pour poser des questions.\n' +
            '3. Utilisez le bouton + pour ajouter des fichiers ou traduire.\n' +
            '4. Accédez aux rappels, paramètres et autres fonctionnalités depuis le menu.'
          )
        }
      >
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>💬 Comment utiliser Jarvis ?</Text>
            <Text style={styles.cardDescription}>Guide rapide pour bien démarrer.</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Rappels */}
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          showHelp(
            '🔔 Comment programmer un rappel ?',
            '1. Allez dans Rappels depuis le menu.\n' +
            '2. Appuyez sur "Programmer un rappel".\n' +
            '3. Remplissez le nom, la description, la date et l\'heure.\n' +
            '4. Appuyez sur "Enregistrer".\n' +
            '5. Le rappel apparaîtra dans votre liste.'
          )
        }
      >
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>🔔 Comment programmer un rappel ?</Text>
            <Text style={styles.cardDescription}>Apprenez à gérer vos rappels facilement.</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Délesteur */}
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          showHelp(
            '⚡ Comment gérer le délesteur ?',
            '1. Depuis l\'écran d\'accueil, choisissez "Contrôler votre dépense énergétique".\n' +
            '2. Vous verrez la puissance actuelle et la température.\n' +
            '3. Les relais affichent leur état (ON/OFF).\n' +
            '4. Vous pouvez suivre vos économies en temps réel.'
          )
        }
      >
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>⚡ Comment gérer le délesteur ?</Text>
            <Text style={styles.cardDescription}>Contrôlez votre consommation d'énergie.</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>

      {/* FAQ */}
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          showHelp(
            '❓ Questions fréquentes (FAQ)',
            'Q : Jarvis est-il gratuit ?\n' +
            'R : Oui, totalement gratuit pour tous les utilisateurs.\n\n' +
            'Q : Mes données sont-elles sécurisées ?\n' +
            'R : Oui, elles sont stockées localement sur votre appareil.\n\n' +
            'Q : Puis-je utiliser Jarvis sans connexion ?\n' +
            'R : Non, une connexion Internet est nécessaire pour les réponses IA.\n\n' +
            'Q : Comment modifier un rappel ?\n' +
            'R : Pour l\'instant, vous pouvez le supprimer et en recréer un nouveau.'
          )
        }
      >
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>❓ Questions fréquentes (FAQ)</Text>
            <Text style={styles.cardDescription}>Réponses aux questions les plus posées.</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Contact support */}
      <TouchableOpacity style={styles.card} onPress={contactSupport}>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>📧 Contacter le support</Text>
            <Text style={styles.cardDescription}>Envoyez un message pour obtenir de l'aide.</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>
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
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '500',
  },
  cardDescription: {
    color: '#6B6B6B',
    fontSize: 13,
    marginTop: 2,
  },
  arrow: {
    color: '#6B6B6B',
    fontSize: 24,
    fontWeight: '300',
  },
});