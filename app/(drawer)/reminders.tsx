import { View, Text, StyleSheet } from 'react-native';
export default function RemindersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Reminders — En construction</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#FFD700', fontSize: 18 },
});
