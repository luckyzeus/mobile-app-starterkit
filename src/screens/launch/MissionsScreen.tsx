import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '../../theme/typography';

const { width, height } = Dimensions.get('window');

export default function MissionsScreen() {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.root}>
      <LinearGradient colors={['rgba(38,31,47,.25)', 'rgba(246,244,246,.05)']} style={styles.overlay} />
      <View style={styles.section}>
        <Text style={styles.title}>Missions</Text>

        {/* Completed example */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, styles.completed]}>Mission #1: <Text style={styles.missionDescription}>Sign up </Text> </Text>
          <Text style={[styles.cardCount, styles.completed]}>1/1 (Completed)</Text>
        </View>

        {/* Expandable example */}
        <Animated.View layout={LinearTransition.springify()} style={{ marginTop: 16 }}>
          {!expanded && (
            <TouchableOpacity style={styles.card} onPress={() => setExpanded(true)}>
              <Text style={styles.cardTitle}>Mission #2: <Text style={styles.missionDescription}>Customize this template</Text> </Text>
              <Text style={styles.cardCount}>0/4</Text>
            </TouchableOpacity>
          )}

          {expanded && (
            <Animated.View style={styles.expanded} layout={LinearTransition.springify()}>
              <Text style={styles.expTitle}>Mission #2</Text>
              <Text style={styles.expSub}>(0/4 Quests completed)</Text>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.task}>1. Check at the Docs, ReadMe, and Examples.</Text>
                <Text style={styles.task}>2. Try switching to the EAS dev mode to utilize native modules and to enable better production ops and testing.</Text>
                <Text style={styles.task}>3. Expand on this template and make it your own by bringing in your own assets, tweaking styling, and using your own actual data/backend.</Text>
                <Text style={styles.task}>4. Reach out whenever for help (or to help as a contributor!), and keep an eye out for the Indemni iOS playtests starting soon (shameless plug) - info at www.indemni.io !</Text>
              </View>

              <TouchableOpacity style={styles.closeBtn} onPress={() => setExpanded(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.footerHint}>Complete the current mission to unlock more.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  overlay: { position: 'absolute', width, height, zIndex: 0 },
  section: { padding: 16, marginTop: 24 },
  title: { fontSize: 32, color: '#ef1f65', fontFamily: Fonts.BarlowCondensed700Italic, textAlign: 'center' },
  card: {
    backgroundColor: '#fff', padding: 16, borderRadius: 8, borderWidth: 2, borderColor: '#000',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
  },
  cardTitle: { fontFamily: Fonts.InterBold, fontSize: 16, color: '#0b190c', width: 220 },
  missionDescription: { fontSize: 14 },
  cardCount: { fontFamily: Fonts.InterBold, fontSize: 14, color: '#0b190c', width: 100, textAlign: 'right' },
  completed: { color: 'grey', textDecorationLine: 'line-through' },
  expanded: {
    backgroundColor: '#eee', padding: 16, borderRadius: 8, borderWidth: 2, borderColor: '#000',
  },
  expTitle: { fontFamily: Fonts.InterBold, fontSize: 18 },
  expSub: { fontFamily: Fonts.InterMedium, fontSize: 14, color: '#444', marginTop: 4 },
  task: { fontFamily: Fonts.InterRegular, fontSize: 14, color: '#222', marginBottom: 5 },
  closeBtn: { alignSelf: 'flex-end', marginTop: 16, backgroundColor: '#000', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  closeText: { color: '#fff', fontFamily: Fonts.InterBold },
  footerHint: { textAlign: 'center', fontFamily: Fonts.InterBold, fontSize: 16, color: '#0b190c' },
});
