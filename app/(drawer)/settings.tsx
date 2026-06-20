import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SettingItem {
  icon: string;
  label: string;
  type: 'navigate' | 'toggle' | 'value' | 'action';
  action?: () => void;
  value?: string;
}

interface Section {
  id: string;
  title: string;
  icon: string;
  items: SettingItem[];
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('general');
  const [notifications, setNotifications] = useState(true);
  const [secureNotifications, setSecureNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isMemoryEnabled, setIsMemoryEnabled] = useState(true);
  const [memoryItems, setMemoryItems] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    loadMemory();
  }, []);

  const loadMemory = async () => {
    try {
      const stored = await AsyncStorage.getItem('memory');
      if (stored) {
        const parsed = JSON.parse(stored);
        const items = Object.entries(parsed).map(([key, value]) => ({ key, value: value as string }));
        setMemoryItems(items);
      }
    } catch (e) {}
  };

  const deleteMemoryItem = async (key: string) => {
    try {
      const stored = await AsyncStorage.getItem('memory');
      if (stored) {
        const parsed = JSON.parse(stored);
        delete parsed[key];
        await AsyncStorage.setItem('memory', JSON.stringify(parsed));
        setMemoryItems(Object.entries(parsed).map(([k, v]) => ({ key: k, value: v as string })));
      }
    } catch (e) {}
  };

  const handleLogout = async () => {
    Alert.alert(
      'Deconnexion',
      'Voulez-vous vraiment vous deconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se deconnecter',
          style: 'destructive',
          onPress: async () => {
            try {
              await auth().signOut();
              await AsyncStorage.clear();
              router.replace('/login');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de se deconnecter.');
            }
          },
        },
      ]
    );
  };

  const showComingSoon = (title: string) => {
    Alert.alert(title, 'Cette fonctionnalite sera disponible prochainement.');
  };

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          'Mise a jour disponible',
          'Voulez-vous telecharger et installer la mise a jour ?',
          [
            { text: 'Plus tard', style: 'cancel' },
            {
              text: 'Installer',
              onPress: async () => {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
              },
            },
          ]
        );
      } else {
        Alert.alert('Aucune mise a jour', 'Vous utilisez deja la derniere version.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de verifier les mises a jour.');
    }
  };

  const toggleSection = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === id ? null : id);
  };

  const sections: Section[] = [
    {
      id: 'navigation',
      title: 'Navigation',
      icon: 'compass-outline',
      items: [
        { icon: 'home-outline', label: 'Accueil', type: 'navigate', action: () => router.push('/home') },
        { icon: 'flash-outline', label: 'Delesteur', type: 'navigate', action: () => router.push('/energy') },
      ],
    },
    {
      id: 'audio',
      title: 'Audio',
      icon: 'volume-high-outline',
      items: [
        {
          icon: 'volume-high-outline',
          label: 'Synthese vocale',
          type: 'toggle',
          action: () => setIsSpeechEnabled(!isSpeechEnabled),
        },
      ],
    },
    {
      id: 'memory',
      title: 'Memoire',
      icon: 'brain-outline',
      items: [
        {
          icon: 'brain-outline',
          label: 'Activer la memoire',
          type: 'toggle',
          action: () => setIsMemoryEnabled(!isMemoryEnabled),
        },
      ],
    },
    {
      id: 'personalization',
      title: 'Personnalisation',
      icon: 'color-palette-outline',
      items: [
        {
          icon: 'color-palette-outline',
          label: 'Personnalisation (a venir)',
          type: 'action',
          action: () => Alert.alert('Personnalisation', 'Cette fonctionnalite sera disponible prochainement.'),
        },
      ],
    },
    {
      id: 'general',
      title: 'General',
      icon: 'settings-outline',
      items: [
        { icon: 'moon-outline', label: 'Mode sombre', type: 'toggle' },
        { icon: 'language-outline', label: 'Langue', type: 'value', value: 'Francais' },
        {
          icon: 'cloud-upload-outline',
          label: 'Verifier les mises a jour',
          type: 'action',
          action: checkForUpdates,
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      items: [
        { icon: 'notifications-outline', label: 'Notifications', type: 'toggle' },
        { icon: 'shield-checkmark-outline', label: 'Notifications securisees', type: 'toggle' },
      ],
    },
    {
      id: 'account',
      title: 'Compte',
      icon: 'person-outline',
      items: [
        { icon: 'stats-chart-outline', label: 'Credit consomme', type: 'action', action: () => showComingSoon('Credit consomme') },
        { icon: 'lock-closed-outline', label: 'Confidentialite', type: 'action', action: () => showComingSoon('Confidentialite') },
      ],
    },
  ];

  const filteredSections = search.trim()
    ? sections.map(s => ({
        ...s,
        items: s.items.filter(i => i.label.toLowerCase().includes(search.toLowerCase())),
      })).filter(s => s.items.length > 0)
    : sections;

  const renderItemRight = (item: SettingItem) => {
    if (item.type === 'toggle') {
      let value = false;
      let setValue: (v: boolean) => void = () => {};
      if (item.label === 'Mode sombre') { value = darkMode; setValue = setDarkMode; }
      else if (item.label === 'Notifications') { value = notifications; setValue = setNotifications; }
      else if (item.label === 'Notifications securisees') { value = secureNotifications; setValue = setSecureNotifications; }
      else if (item.label === 'Synthese vocale') { value = isSpeechEnabled; setValue = setIsSpeechEnabled; }
      else if (item.label === 'Activer la memoire') { value = isMemoryEnabled; setValue = setIsMemoryEnabled; }
      return (
        <Switch
          value={value}
          onValueChange={setValue}
          trackColor={{ false: '#2A2A2A', true: '#FFFFFF' }}
          thumbColor={value ? '#000000' : '#888888'}
        />
      );
    }
    if (item.type === 'value') {
      return (
        <View style={styles.itemRight}>
          <Text style={styles.itemValue}>{item.value}</Text>
          <Ionicons name="chevron-forward" size={16} color="#555555" />
        </View>
      );
    }
    return <Ionicons name="chevron-forward" size={16} color="#555555" />;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parametres</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#555555" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher dans les parametres..."
          placeholderTextColor="#555555"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#555555" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {filteredSections.map((section) => {
          const isExpanded = search.trim() ? true : expandedSection === section.id;
          return (
            <View key={section.id} style={styles.sectionWrapper}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => !search.trim() && toggleSection(section.id)}
                activeOpacity={0.7}
              >
                <View style={styles.sectionHeaderLeft}>
                  <View style={styles.sectionIconBox}>
                    <Ionicons name={section.icon as any} size={16} color="#FFFFFF" />
                  </View>
                  <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
                </View>
                {!search.trim() && (
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#555555"
                  />
                )}
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.card}>
                  {section.items.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <TouchableOpacity
                        style={styles.item}
                        onPress={item.action}
                        disabled={item.type === 'toggle'}
                        activeOpacity={0.6}
                      >
                        <View style={styles.itemLeft}>
                          <Ionicons name={item.icon as any} size={18} color="#FFFFFF" />
                          <Text style={styles.itemText}>{item.label}</Text>
                        </View>
                        {renderItemRight(item)}
                      </TouchableOpacity>
                      {idx < section.items.length - 1 && <View style={styles.divider} />}
                    </React.Fragment>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {isMemoryEnabled && memoryItems.length > 0 && (
          <View style={styles.memoryCard}>
            <Text style={styles.memoryTitle}>Memoire de Jarvis</Text>
            {memoryItems.map((item) => (
              <View key={item.key} style={styles.memoryItem}>
                <Text style={styles.memoryText}>
                  <Text style={styles.memoryKey}>{item.key}</Text> : {item.value}
                </Text>
                <TouchableOpacity onPress={() => deleteMemoryItem(item.key)}>
                  <Ionicons name="trash-outline" size={16} color="#FF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {!search.trim() && (
          <TouchableOpacity style={styles.logoutCard} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={20} color="#FF4444" />
            <Text style={styles.logoutText}>Deconnexion</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>JARVIS · Version 1.0.0</Text>
        </View>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#111111',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  sectionWrapper: {
    marginTop: 12,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  sectionHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  itemValue: {
    color: '#555555',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#1A1A1A',
    marginLeft: 46,
  },
  memoryCard: {
    backgroundColor: '#111111',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  memoryTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  memoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  memoryText: {
    color: '#888888',
    fontSize: 13,
  },
  memoryKey: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1A1111',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A1A1A',
  },
  logoutText: {
    color: '#FF4444',
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#444444',
    fontSize: 12,
  },
});