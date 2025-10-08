import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { useUserStore } from '../../state/client/userStore';
import { data } from '../../services/switchboard';
import { useOnboardingStore } from '../../state/client/onboardingStore';
import { useUpsertUser } from '../../services/user/queries';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../../services/switchboard';
import { Fonts } from '../../theme/typography';
import { Image } from 'expo-image';


type Props = { navigation: any };

// Simple placeholder for now
// TODO: make a bit nicer to match styling and tie in the global/persistence logic.
export default function SignInScreen({ navigation }: Props) {
  // global state
  const { setUid, setLoggedIn, setNewUser } = useUserStore();
  const newUser = useUserStore((s) => s.newUser);
  const username = useUserStore((s) => s.username);
  const setHasFinishedOnboarding = useOnboardingStore((s) => s.setHasFinished);

  // upsert mutation
  const upsert = useUpsertUser();

  // unified sign-in for both buttons (mock today; real providers later)
  const doProviderSignIn = useCallback(async (provider: 'apple' | 'google') => {
    try {
      const res = await (auth as any).signIn?.(); // managed/seed path → mock
      const signedUid = res?.uid ?? 'dev_001';
      setUid(signedUid);

      await upsert.mutateAsync({ uid: signedUid, username: username || 'Guest', isLoggedIn: true, newUser: false });

      setLoggedIn(true);
      setNewUser(false);
      const doc = await data.getUser(signedUid);
      setHasFinishedOnboarding(!!doc?.hasFinishedOnboarding);
      if (doc?.username) useUserStore.getState().setUsername(doc.username);
      Toast.show({ type: 'success', text1: `${provider === 'apple' ? 'Apple' : 'Google'} linked` });
    } catch (e) {
      Toast.show({ type: 'error', text1: `${provider} sign-in failed` });
    }
  }, [setUid, setLoggedIn, setNewUser, upsert, username]);

  const handleBackToSignUp = async () => {
    navigation.navigate('Landing');
  };

  return (
    <View style={styles.container}>

      <LinearGradient
        colors={['rgba(38, 31, 47, .4)', 'rgba(246, 244, 246, .1)', 'rgba(246, 244, 246, .1)', 'rgba(38, 31, 47, .4)']}
        style={styles.overlay}
      />

      <View style={styles.mainContainer}>
        <View style={[styles.headerContainer, { top: 80 }]}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>INDEMNI</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.bottomTextContainer}>
            <Text style={styles.bottomText}>
              {newUser ? 'Welcome Back Gamer!' : `Welcome Back ${username || 'Player'}!`}
            </Text>
          </View>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.formContainer}>
              {Platform.OS === 'ios' && (
                <TouchableOpacity style={styles.appleButton} onPress={() => doProviderSignIn('apple')}>
                  <Text style={styles.appleButtonText}>Sign In with Apple (mock)</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.googleButton} onPress={() => doProviderSignIn('google')}>
                <Image source={require('../../../assets/icons/google-icon-small.png')} style={styles.googleIcon} contentFit='contain' />
                <Text style={styles.googleButtonText}>Sign In with Google (mock)</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.secondaryButtonContainer}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleBackToSignUp}>
              <Text style={styles.secondaryButtonText}>
                {!newUser && username ? 'I want a new account.' : 'JK ... I need to make an account.'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%' },
  videoContainer: { position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  backgroundVideo: { width: '100%', height: '100%' },
  frameImageContainer: { position: 'absolute', width: '100%', height: '100%' },
  frameImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject },
  mainContainer: { flex: 1 },
  headerContainer: { alignItems: 'center' },
  titleWrapper: {},
  title: { color: '#fff', fontSize: 48, fontWeight: '900', letterSpacing: 2, marginTop: 80 },
  contentContainer: { flex: 1, padding: 24, justifyContent: 'flex-end' },
  bottomTextContainer: { alignItems: 'center', marginBottom: 12 },
  bottomText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  formContainer: { gap: 12 },
  appleButton: { backgroundColor: '#fff', height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  appleButtonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  googleButton: { flexDirection: 'row', gap: 6, backgroundColor: '#fff', height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  googleIcon: { width: 20, height: 20 },
  googleButtonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  secondaryButtonContainer: { marginTop: 16, alignItems: 'center' },
  secondaryButton: { paddingVertical: 10, paddingHorizontal: 12 },
  secondaryButtonText: { color: '#ef1f65', fontWeight: '600' }
});