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
      <Drawer.Screen
        name="new-chat"
        options={{
          title: 'Nouvelle discussion',
          drawerLabel: '➕ Nouvelle discussion',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="home"
        options={{
          title: 'Accueil',
          drawerLabel: 'Accueil',
          headerShown: false,
          swipeEnabled: false,
        }}
      />
      <Drawer.Screen name="chat" options={{ title: 'Chat', drawerLabel: 'Discussions', headerShown: false }} />
      <Drawer.Screen name="reminders" options={{ title: 'Rappels', drawerLabel: 'Rappels', headerShown: false }} />
      <Drawer.Screen name="reports" options={{ title: 'Rapports', drawerLabel: 'Rapports', headerShown: false }} />
      <Drawer.Screen name="settings" options={{ title: 'Paramètres', drawerLabel: 'Paramètres', headerShown: false }} />
      <Drawer.Screen name="security" options={{ title: 'Sécurité', drawerLabel: 'Sécurité', headerShown: false }} />
      <Drawer.Screen name="help" options={{ title: 'Aide', drawerLabel: 'Aide', headerShown: false }} />
      <Drawer.Screen name="about" options={{ title: 'À propos', drawerLabel: 'À propos', headerShown: false }} />

      <Drawer.Screen
        name="energy"
        options={{
          title: 'Délesteur',
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="about-legal"
        options={{
          title: 'Mentions légales',
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="about-github"
        options={{
          title: 'GitHub',
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="about-jarvis"
        options={{
          title: 'À propos de JARVIS',
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="about-developer"
        options={{
          title: 'Le développeur',
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="add-reminder"
        options={{
          title: 'Ajouter un rappel',
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
    </Drawer>
  );
}
