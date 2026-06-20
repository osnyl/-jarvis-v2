import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ARCHIVES_KEY = 'chat_archives';

export default function NewChatScreen() {
  const router = useRouter();

  useEffect(() => {
    const archiveAndClear = async () => {
      // 1. Récupère la conversation actuelle
      const currentChat = await AsyncStorage.getItem('chat_messages');
      
      if (currentChat) {
        const messages = JSON.parse(currentChat);
        
        // 2. Archive seulement si y a au moins 2 messages
        if (messages.length >= 2) {
          const existingArchives = await AsyncStorage.getItem(ARCHIVES_KEY);
          const archives = existingArchives ? JSON.parse(existingArchives) : [];
          
          const newArchive = {
            id: Date.now().toString(),
            date: new Date().toLocaleString('fr-FR'),
            title: messages[0]?.text?.slice(0, 30) + '...' || 'Conversation',
            messages: messages,
            messageCount: messages.length,
          };
          
          archives.unshift(newArchive);
          
          // Limite à 20 archives
          if (archives.length > 20) archives.pop();
          
          await AsyncStorage.setItem(ARCHIVES_KEY, JSON.stringify(archives));
        }
      }
      
      // 3. Efface le chat actuel
      await AsyncStorage.removeItem('chat_messages');
      
      // 4. Redirige
      router.replace('/(drawer)/chat');
    };
    
    archiveAndClear();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});