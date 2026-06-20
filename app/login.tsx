import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

GoogleSignin.configure({
  webClientId: '587082638085-08jncs7ri3uig5d7bopq5aj7a7ilnss6.apps.googleusercontent.com',
});

const FIRST_LAUNCH_KEY = 'jarvis_first_launch';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = auth().currentUser;
      const isFirstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
      
      if (currentUser && isFirstLaunch === 'false') {
        router.replace('/(drawer)/home');
      } else {
        setCheckingAuth(false);
      }
    } catch (e) {
      setCheckingAuth(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(data?.idToken ?? '');
      await auth().signInWithCredential(googleCredential);
      await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false');
      router.replace('/(drawer)/home');
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Échec de la connexion');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>◆</Text>
      </View>
      <Text style={styles.title}>JARVIS</Text>
      <Text style={styles.subtitle}>Votre Assistant IA Personnel</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleGoogleLogin} 
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#000000" />
        ) : (
          <Text style={styles.buttonText}>Se connecter avec Google</Text>
        )}
      </TouchableOpacity>
      
      <Text style={styles.footer}>Projet étudiant ENSET Lokossa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  icon: { 
    fontSize: 40, 
    color: '#FFFFFF',
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#FFFFFF', 
    letterSpacing: 6,
    marginBottom: 8,
  },
  subtitle: { 
    fontSize: 14, 
    color: '#666666', 
    marginBottom: 48,
    letterSpacing: 0.5,
  },
  button: { 
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 32, 
    paddingVertical: 16, 
    borderRadius: 12, 
    width: '100%', 
    maxWidth: 320,
    alignItems: 'center',
  },
  buttonText: { 
    color: '#000000', 
    fontWeight: '600', 
    fontSize: 15,
    letterSpacing: 0.3,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: '#333333',
  },
});