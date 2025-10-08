import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '../../theme/typography';
import { useUserStore } from '../../state/client/userStore';
import { deleteAccount } from '../../services/user/api';
import { clearAllPersistence } from '../../services/dev/maintenance';
import { auth } from '../../services/switchboard';

const { width, height } = Dimensions.get('window');

export default function LaunchHomeScreen({ navigation }: any) {
  const setLoggedIn = useUserStore((s) => s.setLoggedIn);
  const username = useUserStore((s) => s.username);
  const uid = useUserStore((s) => s.uid);

  const doSignOut = async () => {
    try { await (auth as any).signOut?.(); } finally { await clearAllPersistence(); }
  };

  const doDelete = async () => {
    const res = await deleteAccount(uid!, username);
    if (res.success) await clearAllPersistence();
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['rgba(38,31,47,.5)', 'rgba(246,244,246,.1)']}
        style={styles.overlay}
      />
      <View style={styles.header}>
        <Text style={styles.title}>INDEMNI</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.welcome}>
          Welcome Home <Text style={styles.rr}>{username ? username : 'Guest'}</Text>
        </Text>
        <Text style={styles.desc}>Start your first mission!</Text>

        <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('Missions')}>
          <Text style={styles.primaryText}>Missions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondary} onPress={doSignOut}>
          <Text style={styles.primaryText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Quick delete account btn for testing - see '../../services/user/api' */}
        <TouchableOpacity style={[styles.secondary, { backgroundColor: '#ef1f65', marginTop: 12 }]} onPress={doDelete}>
          <Text style={styles.primaryText}>Delete Account (dev)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f7f7f7' },
  overlay: { position: 'absolute', width, height, zIndex: 0 },
  header: { alignItems: 'center', marginTop: 56 },
  title: { fontSize: 64, color: '#fff', fontFamily: Fonts.RoadRage, textShadowColor: '#000', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  body: { marginTop: 48, paddingHorizontal: 24 },
  welcome: { textAlign: 'center', fontSize: 28, color: '#474247', fontFamily: Fonts.BarlowCondensed700Italic },
  rr: { color: '#ef1f65', fontFamily: Fonts.RoadRage, textDecorationLine: 'underline' },
  desc: { textAlign: 'center', marginTop: 12, fontSize: 18, color: '#474247', fontFamily: Fonts.BarlowCondensed700Italic },
  primary: {
    marginTop: 16, backgroundColor: '#fff', padding: 18, borderRadius: 8, borderWidth: 2, borderColor: '#000',
    alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 6, shadowOffset: { width: 0, height: 4 },
  },
  secondary: {
    marginTop: 48, backgroundColor: '#54D7FF', padding: 18, borderRadius: 8, borderWidth: 2, borderColor: '#000',
    alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 6, shadowOffset: { width: 0, height: 4 },
  },
  primaryText: { color: '#0b190c', fontSize: 16, fontFamily: Fonts.InterBold },
});
