import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text as RNText,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image as RNImage,
} from 'react-native';
import Animated, {
  Easing as ReanimatedEasing,
  useSharedValue,
  withTiming,
  withRepeat,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Video, ResizeMode } from 'expo-av';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { useAssetsStore } from '../../state/client/assetsStore';
import { useOnboardingStore } from '../../state/client/onboardingStore';
import { useUserStore } from '../../state/client/userStore';
import LoaderOne from '../../utils/loaders/LoaderOne';
import { Fonts } from '../../theme/typography';
import { onboardingCreateUser } from '../../services/user/api';
import { auth, data } from '../../services/switchboard';
import { useQueryClient } from '@tanstack/react-query';

type Props = { navigation: any };

export default function SignUpScreen({ navigation }: Props) {
  // stores
  const username = useOnboardingStore((s) => s.onboardingUsername);
  const setHasFinished = useOnboardingStore((s) => s.setHasFinished);
  const setHasStarted = useOnboardingStore((s) => s.setHasStarted);

  const setLoggedIn = useUserStore((s) => s.setLoggedIn);
  const setUid = useUserStore((s) => s.setUid);
  const setUserNameStore = useUserStore((s) => s.setUsername);
  const qc = useQueryClient();

  // preloaded assets
  const signUpVideoUri = useAssetsStore((s) => s.cachedAssets.signUpVideo as string | undefined);

  // local ui state
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [showProviderButtons, setShowProviderButtons] = useState(true);

  // animations: simple opacity + looping scale on video
  const screenOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const videoOpacity = useSharedValue(0);
  const videoScale = useSharedValue(1);

  const videoRef = useRef<Video>(null);

  useEffect(() => {
    // stage in: background/content
    screenOpacity.value = withTiming(1, { duration: 450, easing: ReanimatedEasing.out(ReanimatedEasing.ease) });
    contentOpacity.value = withTiming(1, { duration: 700, easing: ReanimatedEasing.out(ReanimatedEasing.ease), });
    videoOpacity.value = withTiming(1, { duration: 900, easing: ReanimatedEasing.out(ReanimatedEasing.ease), });

    // looping scale for the ink blot vibe
    videoScale.value = withRepeat(
      withTiming(1.05, { duration: 2000, easing: ReanimatedEasing.inOut(ReanimatedEasing.ease) }),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));
  const videoStyle = useAnimatedStyle(() => ({
    opacity: videoOpacity.value,
    transform: [{ scale: videoScale.value }],
  }));

  // ---- sign up (works in seed today, live later) ----
  const doSignUp = async () => {
    try {
      setLoaderVisible(true);

      // get or create uid (managed/mock provides static; native/web uses real)
      let current = (auth as any).currentUser?.();
      if (!current?.uid && (auth as any).signIn) current = await (auth as any).signIn();
      const theUid = current?.uid ?? 'dev_001';
      setUid(theUid);

      // create via callable/live OR seed upsert
      const res = await onboardingCreateUser({ uid: theUid, username: username || 'user' });
      if (!res.success) throw new Error('onboardingCreateUser failed');

      // mark finished locally + a final upsert to be safe
      await data.upsertUser({ uid: theUid, username: username || 'user', hasFinishedOnboarding: true, newUser: false });

      setUserNameStore(username || 'user');
      setHasStarted(true);
      setHasFinished(true);
      setLoggedIn(true);

      setLoaderVisible(false);
      Toast.show({ type: 'success', text1: 'Account ready' });

      await qc.invalidateQueries({ queryKey: ['me', theUid] });
    } catch (e) {
      setLoaderVisible(false);
      Toast.show({ type: 'error', text1: 'Sign-up failed', text2: 'Please try again' });
    }
  };

  // ---- mock provider linkers (UI only; real flows commented for later) ----
  const runProviderMock = async (provider: 'apple' | 'google') => {
    setLoaderVisible(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoaderVisible(false);
    setShowProviderButtons(false);
    Toast.show({ type: 'success', text1: `${provider === 'apple' ? 'Apple' : 'Google'} linked` });
  };

  // assets for images in this screen (use local requires to match the look)
  const selectUsernameBG = useMemo(
    () => require('../../../assets/background/default-bg.jpg'), // adjust filename if needed
    []
  );
  const brushStroke2 = useMemo(
    () => require('../../../assets/signup/brush-stroke.png'),
    []
  );
  const googleIcon = useMemo(
    () => require('../../../assets/icons/google-icon-small.png'),
    []
  );

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <Animated.View style={[styles.container, screenStyle]}>
      {/* background still */}
      <Image source={selectUsernameBG} style={styles.backgroundImage} contentFit="cover" />

      {/* ink blot video (second version) */}
      {signUpVideoUri ? (
        <Animated.View style={[styles.smokeVideoContainer, videoStyle]}>
          <Video
            ref={videoRef}
            source={{ uri: signUpVideoUri }}
            style={styles.backgroundVideo}
            shouldPlay
            resizeMode={ResizeMode.CONTAIN}
          />
        </Animated.View>
      ) : null}

      {/* soft overlay */}
      <View style={styles.overlay} />

      {/* main content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <StatusBar style='dark' />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View style={[styles.contentContainer, contentStyle]}>
            <View style={styles.titleContainer}>
              <RNText style={styles.title}>Step Two</RNText>
            </View>
            <View style={styles.subTitleContainer}>
              <RNText style={styles.subTitle}>Welcome {username || 'User'}!</RNText>
            </View>
            <View style={styles.descriptionContainer}>
              <RNText style={styles.descriptionText}>Choose how you would like to Sign up</RNText>
            </View>

            <View style={styles.buttonContainer}>
              {showProviderButtons ? (
                <>
                  {/* Apple (mock) */}
                  <TouchableOpacity
                    style={styles.appleButton}
                    onPress={() => runProviderMock('apple')}
                    activeOpacity={0.9}
                  >
                    <RNText style={styles.appleButtonText}>Sign up with Apple (mock)</RNText>
                  </TouchableOpacity>

                  {/* Google (mock) */}
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={() => runProviderMock('google')}
                    activeOpacity={0.9}
                  >
                    <Image source={googleIcon} style={styles.googleIcon} contentFit="contain" />
                    <RNText style={styles.googleButtonText}>Sign up with Google (mock)</RNText>
                  </TouchableOpacity>

                  {/* divider */}
                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <RNText style={styles.dividerText}>or</RNText>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Choose a different name (back to Landing) – leave this as a placeholder button */}
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={onBack}
                    activeOpacity={0.9}
                  >
                    <RNText style={styles.primaryButtonText}>Choose a Different Name</RNText>
                  </TouchableOpacity>
                </>
              ) : (
                // After provider success → reveal your real signup (mock) action
                <TouchableOpacity style={styles.primaryButton} onPress={doSignUp} activeOpacity={0.9}>
                  <RNText style={styles.primaryButtonText}>Finish Sign Up</RNText>
                </TouchableOpacity>
              )}
            </View>

            {/* bottom flair (brush + text) */}
            <View style={styles.bottomImagesContainer}>
              {showProviderButtons && (
                <>
                  <Image source={brushStroke2} style={styles.brushStrokeImage} contentFit="contain" pointerEvents="none" />
                  <RNText style={styles.bottomTextOne}>Join the {'\n'} Family</RNText>
                </>
              )}
            </View>

            <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
              <RNText style={{ fontSize: 15, color: '#1e1e1e', textAlign: 'center' }}>
                By signing up, you you agree to our:{'\n'}
                <RNText style={{ color: '#1bc9fe', textDecorationLine: 'underline' }}>
                  {' '}Privacy Policy
                </RNText>
                {' '}and
                <RNText style={{ color: '#1bc9fe', textDecorationLine: 'underline' }}>
                  {' '}Terms of Service
                </RNText>
              </RNText>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Loader overlay */}
      <LoaderOne isVisible={loaderVisible} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
  backgroundImage: {
    width: '110%',
    height: '110%',
    position: 'absolute',
    zIndex: 0,
  },
  smokeVideoContainer: {
    position: 'absolute',
    bottom: 240,
    right: 0,
    left: -215,
    width: 820,
    height: 820,
    zIndex: 0,
  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 15,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 90,
    paddingHorizontal: 20,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 15,
  },
  titleContainer: { alignItems: 'flex-start', marginTop: 4 },
  title: {
    fontSize: 44,
    color: '#ef1f65',
    fontFamily: Fonts.BarlowCondensed700Italic,
    textDecorationLine: 'underline',
  },
  subTitleContainer: { marginTop: 12, marginBottom: 8 },
  subTitle: { color: '#f6f4f6', fontSize: 22, fontFamily: Fonts.InterBold },
  descriptionContainer: { marginBottom: 4 },
  descriptionText: { fontSize: 16, color: '#f6f4f6', fontFamily: Fonts.InterRegular },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 10.3,
  },
  appleButton: {
    width: '100%',
    height: 50,
    borderRadius: 30,
    marginTop: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleButtonText: {
    color: '#000',
    fontSize: 19,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 50,
    width: '100%',
    justifyContent: 'center',
    marginTop: 16,
  },
  googleIcon: { width: 20, height: 20, marginRight: 6 },
  googleButtonText: { color: 'black', fontSize: 19, fontWeight: '500' },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 50,
    width: '100%',
    justifyContent: 'center',
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#000',
  },
  primaryButtonText: { color: 'black', fontSize: 19, fontWeight: '500' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    width: '100%',
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'grey' },
  dividerText: { fontSize: 16, paddingHorizontal: 6, color: '#fff', textAlign: 'center' },
  bottomImagesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brushStrokeImage: {
    width: 500,
    height: 500,
    right: 0,
    zIndex: 16,
    position: 'absolute',
  },
  bottomTextOne: {
    fontSize: 36,
    color: '#ef1f65',
    fontFamily: Fonts.RoadRage,
    zIndex: 16,
    padding: 20,
    flex: 1,
    top: 50,
    right: 65,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5.3,
  },
});
