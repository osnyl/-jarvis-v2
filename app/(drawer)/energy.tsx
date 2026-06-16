import { View, Text, StyleSheet } from 'react-native';
export default function EnergyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Energy — En construction</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#FFD700', fontSize: 18 },
});
