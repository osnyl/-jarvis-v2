import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewChatScreen() {
  const router = useRouter();

  useEffect(() => {
    const clearChat = async () => {
      await AsyncStorage.removeItem('chat_messages');
      router.replace('/chat');
    };
    clearChat();
  }, []);

  return null;
}