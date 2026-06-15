import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="chat" options={{ title: 'Chat', drawerLabel: 'Chat' }} />
    </Drawer>
  );
}
