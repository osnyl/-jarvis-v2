import { Drawer } from 'expo-router/drawer';
import { BackHandler } from 'react-native';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'expo-router';

function BackHandlerProvider() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const backAction = () => {
      if (pathname === '/home' || pathname === '/login') {
        BackHandler.exitApp();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [pathname]);

  return null;
}

export default function DrawerLayout() {
  return (
    <>
      <BackHandlerProvider />
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#000000',
            width: 280,
          },
          drawerLabelStyle: {
            color: '#E5E5E5',
            fontSize: 14,
          },
          drawerActiveTintColor: '#FFFFFF',
          drawerInactiveTintColor: '#888888',
          drawerActiveBackgroundColor: '#1A1A1A',
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            color: '#FFFFFF',
            fontWeight: '700',
          },
        }}
      >
        <Drawer.Screen
          name="new-chat"
          options={{
            title: 'Nouvelle discussion',
            drawerLabel: 'Nouvelle discussion',
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
        <Drawer.Screen 
          name="chat" 
          options={{ 
            title: 'Chat', 
            drawerLabel: 'Discussions', 
            headerShown: false 
          }} 
        />
        <Drawer.Screen 
          name="energy" 
          options={{ 
            title: 'Délesteur', 
            drawerLabel: 'Délesteur', 
            headerShown: false 
          }} 
        />
        <Drawer.Screen 
          name="reminders" 
          options={{ 
            title: 'Rappels', 
            drawerLabel: 'Rappels', 
            headerShown: false 
          }} 
        />
        <Drawer.Screen 
          name="reports" 
          options={{ 
            title: 'Rapports', 
            drawerLabel: 'Rapports', 
            headerShown: false 
          }} 
        />
        <Drawer.Screen 
          name="settings" 
          options={{ 
            title: 'Paramètres', 
            drawerLabel: 'Paramètres', 
            headerShown: false 
          }} 
        />
        <Drawer.Screen 
          name="security" 
          options={{ 
            title: 'Sécurité', 
            drawerLabel: 'Sécurité', 
            headerShown: false 
          }} 
        />
        <Drawer.Screen 
          name="help" 
          options={{ 
            title: 'Aide', 
            drawerLabel: 'Aide', 
            headerShown: false 
          }} 
        />
        <Drawer.Screen 
          name="about" 
          options={{ 
            title: 'À propos', 
            drawerLabel: 'À propos', 
            headerShown: false 
          }} 
        />

        {/* Écrans cachés du menu */}
        <Drawer.Screen
          name="about-legal"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="about-github"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="about-jarvis"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="about-developer"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="add-reminder"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
      </Drawer>
    </>
  );
}