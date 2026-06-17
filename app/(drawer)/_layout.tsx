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

      {/* Écrans principaux */}
      <Drawer.Screen name="home" options={{ title: 'Accueil', drawerLabel: 'Accueil' }} />
      <Drawer.Screen name="chat" options={{ title: 'Chat', drawerLabel: 'Discussions' }} />
      <Drawer.Screen name="reminders" options={{ title: 'Rappels', drawerLabel: 'Rappels' }} />
      <Drawer.Screen name="reports" options={{ title: 'Rapports', drawerLabel: 'Rapports' }} />
      <Drawer.Screen name="settings" options={{ title: 'Paramètres', drawerLabel: 'Paramètres' }} />
      <Drawer.Screen name="security" options={{ title: 'Sécurité', drawerLabel: 'Sécurité' }} />
      <Drawer.Screen name="help" options={{ title: 'Aide', drawerLabel: 'Aide' }} />
      <Drawer.Screen name="about" options={{ title: 'À propos', drawerLabel: 'À propos' }} />
    </Drawer>
  );
}