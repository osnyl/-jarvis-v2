import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="home" options={{ title: 'Accueil', drawerLabel: 'Accueil' }} />
      <Drawer.Screen name="chat" options={{ title: 'Chat', drawerLabel: 'Discussions' }} />
      <Drawer.Screen name="energy" options={{ title: 'Délesteur', drawerLabel: 'Délesteur Énergétique' }} />
      <Drawer.Screen name="reminders" options={{ title: 'Rappels', drawerLabel: 'Rappels' }} />
      <Drawer.Screen name="reports" options={{ title: 'Rapports', drawerLabel: 'Rapports' }} />
      <Drawer.Screen name="settings" options={{ title: 'Paramètres', drawerLabel: 'Paramètres' }} />
      <Drawer.Screen name="security" options={{ title: 'Sécurité', drawerLabel: 'Sécurité' }} />
      <Drawer.Screen name="about" options={{ title: 'À propos', drawerLabel: 'À propos' }} />
    </Drawer>
  );
}