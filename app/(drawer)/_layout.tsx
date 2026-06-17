import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#1A1A1A',
          width: 280,
        },
        drawerLabelStyle: {
          color: '#E5E5E5',
        },
        drawerActiveTintColor: '#FFD700',
        drawerInactiveTintColor: '#A8A8A8',
        headerStyle: {
          backgroundColor: '#0A0A0A',
        },
        headerTintColor: '#E5E5E5',
      }}
    >
      {/* Nouvelle discussion */}
      <Drawer.Screen
        name="new-chat"
        options={{
          title: 'Nouvelle discussion',
          drawerLabel: '➕ Nouvelle discussion',
        }}
      />
      {/* Écran Accueil - SANS drawer/header */}
      <Drawer.Screen
        name="home"
        options={{
          title: 'Accueil',
          drawerLabel: 'Accueil',
          headerShown: false,
          swipeEnabled: false,
        }}
      />
      <Drawer.Screen name="chat" options={{ title: 'Chat', drawerLabel: 'Discussions' }} />
      <Drawer.Screen name="reminders" options={{ title: 'Rappels', drawerLabel: 'Rappels' }} />
      <Drawer.Screen name="reports" options={{ title: 'Rapports', drawerLabel: 'Rapports' }} />
      <Drawer.Screen name="settings" options={{ title: 'Paramètres', drawerLabel: 'Paramètres' }} />
      <Drawer.Screen name="security" options={{ title: 'Sécurité', drawerLabel: 'Sécurité' }} />
      <Drawer.Screen name="help" options={{ title: 'Aide', drawerLabel: 'Aide' }} />
      <Drawer.Screen name="about" options={{ title: 'À propos', drawerLabel: 'À propos' }} />

      {/* Écrans cachés du drawer - accessibles seulement via boutons internes */}
      <Drawer.Screen
        name="energy"
        options={{
          title: 'Délesteur',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="about-legal"
        options={{
          title: 'Mentions légales',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="about-github"
        options={{
          title: 'GitHub',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="about-jarvis"
        options={{
          title: 'À propos de JARVIS',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="about-developer"
        options={{
          title: 'Le développeur',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="add-reminder"
        options={{
          title: 'Ajouter un rappel',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}
