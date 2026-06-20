import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HelpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const showHelp = (title: string, content: string) => {
    Alert.alert(title, content, [{ text: 'OK' }]);
  };

  const contactSupport = () => {
    Linking.openURL('mailto:support@jarvis.com?subject=Aide Jarvis&body=Bonjour, j\'ai besoin d\'aide pour...');
  };

  const helpItems = [
    {
      icon: 'chatbubble-ellipses-outline',
      title: 'Comment utiliser Jarvis ?',
      description: 'Guide rapide pour bien demarrer.',
      content: '1. Connectez-vous avec Google.\n' +
        '2. Choisissez "Discuter avec Jarvis" pour poser des questions.\n' +
        '3. Utilisez le bouton + pour ajouter des fichiers ou traduire.\n' +
        '4. Accedez aux rappels, parametres et autres fonctionnalites depuis le menu.',
    },
    {
      icon: 'notifications-outline',
      title: 'Comment programmer un rappel ?',
      description: 'Apprenez a gerer vos rappels facilement.',
      content: '1. Allez dans Rappels depuis le menu.\n' +
        '2. Appuyez sur "Programmer un rappel".\n' +
        '3. Remplissez le nom, la description, la date et l\'heure.\n' +
        '4. Appuyez sur "Enregistrer".\n' +
        '5. Le rappel apparaitra dans votre liste.',
    },
    {
      icon: 'flash-outline',
      title: 'Comment gerer le delesteur ?',
      description: 'Controlez votre consommation d\'energie.',
      content: '1. Depuis l\'ecran d\'accueil, choisissez "Controler votre depense energetique".\n' +
        '2. Vous verrez la puissance actuelle et la temperature.\n' +
        '3. Les relais affichent leur etat (ON/OFF).\n' +
        '4. Vous pouvez suivre vos economies en temps reel.',
    },
    {
      icon: 'help-circle-outline',
      title: 'Questions frequentes (FAQ)',
      description: 'Reponses aux questions les plus posees.',
      content: 'Q : Jarvis est-il gratuit ?\n' +
        'R : Oui, totalement gratuit pour tous les utilisateurs.\n\n' +
        'Q : Mes donnees sont-elles securisees ?\n' +
        'R : Oui, elles sont stockees localement sur votre appareil.\n\n' +
        'Q : Puis-je utiliser Jarvis sans connexion ?\n' +
        'R : Non, une connexion Internet est necessaire pour les reponses IA.\n\n' +
        'Q : Comment modifier un rappel ?\n' +
        'R : Pour l\'instant, vous pouvez le supprimer et en recreer un nouveau.',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {helpItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => showHelp(item.title, item.content)}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <View style={styles.iconBox}>
                  <Ionicons name={item.icon as any} size={18} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#555555" />
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.contactCard} onPress={contactSupport} activeOpacity={0.7}>
          <View style={styles.cardContent}>
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Ionicons name="mail-outline" size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.cardTitle}>Contacter le support</Text>
                <Text style={styles.cardDescription}>Envoyez un message pour obtenir de l'aide.</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#555555" />
          </View>
        </TouchableOpacity>
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
    paddingBottom: 12,
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
    fontWeight: '700',
    letterSpacing: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#111111',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  contactCard: {
    backgroundColor: '#111111',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    marginTop: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
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
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  cardDescription: {
    color: '#666666',
    fontSize: 13,
    marginTop: 2,
  },
});