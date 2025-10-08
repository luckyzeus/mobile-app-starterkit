import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts } from '../../theme/typography';

export default function MessagesScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Messages</Text>
      <Text style={styles.hint}>This is a nested stack screen in Tabs. Replace with your inbox later.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#121212', padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#f6f4f6', fontSize: 22, fontFamily: Fonts.InterBold },
  hint: { color: '#bbb', fontFamily: Fonts.InterRegular, marginTop: 8, textAlign: 'center' },
});
