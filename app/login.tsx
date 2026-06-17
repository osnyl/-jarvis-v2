import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '587082638085-08jncs7ri3uig5d7bopq5aj7a7ilnss6.apps.googleusercontent.com',
});

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      console.log('Google data:', JSON.stringify(data));
      const googleCredential = auth.GoogleAuthProvider.credential(data?.idToken ?? '');
      const result = await auth().signInWithCredential(googleCredential);
      console.log('Firebase result:', result.user.email);
      router.replace('/home'); // ✅ Redirection vers l'écran d'accueil
    } catch (e: any) {
      console.error('Erreur auth:', e);
      Alert.alert('Erreur', e?.message ?? JSON.stringify(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>J</Text>
      <Text style={styles.title}>JARVIS</Text>
      <Text style={styles.subtitle}>Votre Assistant IA Personnel</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Se connecter avec Google</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', gap: 16 },
  logo: { fontSize: 80, fontWeight: 'bold', color: '#FFD700', textShadowColor: '#FFD700', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFD700', letterSpacing: 8 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 40 },
  button: { backgroundColor: '#FFD700', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 8, width: '80%', alignItems: 'center' },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});