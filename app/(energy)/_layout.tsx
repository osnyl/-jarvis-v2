import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function EnergyLayout() {
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
        headerTintColor: '#FFD700',
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Délesteur',
          drawerLabel: '📊 Tableau de bord',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="historique"
        options={{
          title: 'Historique',
          drawerLabel: '📈 Historique',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="statistiques"
        options={{
          title: 'Statistiques',
          drawerLabel: '📉 Statistiques',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="parametres"
        options={{
          title: 'Paramètres',
          drawerLabel: '⚙️ Paramètres du délesteur',
          headerShown: false,
        }}
      />
    </Drawer>
  );
}