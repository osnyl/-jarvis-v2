import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Jarvis</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.chatButton]}
          onPress={() => router.push('/chat')}
        >
          <Text style={styles.buttonText}>💬 Discuter avec Jarvis</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.energyButton]}
          onPress={() => router.push('/energy')}
        >
          <Text style={styles.buttonText}>⚡ Contrôler votre dépense énergétique</Text>
        </TouchableOpacity>
      </View>

      {/* Lien En savoir plus */}
      <TouchableOpacity onPress={() => router.push('/about-app')}>
        <Text style={styles.footerLink}>En savoir plus</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  chatButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  energyButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footerLink: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 40,
    textDecorationLine: 'underline',
  },
});