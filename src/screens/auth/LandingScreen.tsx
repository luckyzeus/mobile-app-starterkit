import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Alert
} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  useAnimatedStyle,
  Easing as ReanimatedEasing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../state/client/onboardingStore';
import { Fonts } from '../../theme/typography';
import { clearAllPersistence } from '../../services/dev/maintenance';

const { width, height } = Dimensions.get('window');

// Animation values
const INITIAL_LOGO_TOP = 148;
const FINAL_LOGO_TOP = 60;
const LOGO_TX = -105.5;
const LOGO_TY = -73;
const LOGO_SCALE = 0.6;

type Props = { navigation: { navigate: (route: string) => void } };

export default function LandingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const setHasStarted = useOnboardingStore((s) => s.setHasStarted);

  const handleCreate = () => {
    setHasStarted(true);
    navigation.navigate('Username');
  };

  // ---- Animation drivers ----
  const logoAnim = useSharedValue(0);            // 0 -> 1 translates & scales the header block
  const titleSlideX = useSharedValue(width);     // slide wordmark in from right
  const titleOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const bgOpacity = useSharedValue(0);
  const logoOpacity = useSharedValue(0);

  // Entry animation logic
  // Feel free to replace setTimeout blocks with a more streamlined withSequence(withDelay(...), ...) - see Reanimated v3 docs if curious
  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 300, easing: ReanimatedEasing.linear });

    logoAnim.value = withDelay(
      250,
      withTiming(1, { duration: 300, easing: ReanimatedEasing.linear })
    );

    // wordmark slide + fade
    setTimeout(() => {
      titleSlideX.value = withTiming(0, { duration: 1000, easing: ReanimatedEasing.linear });
      titleOpacity.value = withTiming(1, { duration: 1000, easing: ReanimatedEasing.linear });
    }, 500);

    // background & content fade-in
    setTimeout(() => {
      bgOpacity.value = withTiming(1, { duration: 1750, easing: ReanimatedEasing.ease });
      contentOpacity.value = withTiming(1, { duration: 1000, easing: ReanimatedEasing.linear });
    }, 1250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Header block slides up and shrinks (logoAnim drives top/translate/scale)
  const headerPosStyle = useAnimatedStyle(() => ({
    top: INITIAL_LOGO_TOP + (FINAL_LOGO_TOP - INITIAL_LOGO_TOP) * logoAnim.value,
  }));

  const logoTransformStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { translateY: withTiming(logoAnim.value === 1 ? LOGO_TY : 0, { duration: 1000 }) },
      { translateX: withTiming(logoAnim.value === 1 ? LOGO_TX : 0, { duration: 1000 }) },
      { scale: withTiming(logoAnim.value === 1 ? LOGO_SCALE : 1, { duration: 1000 }) },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: titleSlideX.value }],
    opacity: titleOpacity.value,
  }));

  // Mixes in content/background fades
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  return (
    <View style={[styles.root]}>
      <ImageBackground
        source={require('../../../assets/background/landing-bg.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* Soft film overlay that fades in */}
        <Animated.View style={[styles.bgDimmer, backgroundStyle]} />
        <LinearGradient
          colors={[
            'rgba(38, 31, 47, .4)',
            'rgba(246, 244, 246, .10)',
            'rgba(246, 244, 246, .10)',
            'rgba(38, 31, 47, .4)',
          ]}
          style={styles.overlay}
        />

        {/* Header block (positioned) */}
        <Animated.View style={[styles.headerContainer, headerPosStyle]}>
          <Animated.View style={[styles.logoContainer, logoTransformStyle]}>
          </Animated.View>
          <Animated.View style={[styles.titleWrapper, titleStyle]}>
            <Text style={styles.wordmark}>INDEMNI</Text>
          </Animated.View>
        </Animated.View>

        {/* Body content */}
        <Animated.View style={[styles.content, contentStyle]}>

          <View style={styles.textBlock}>
            <Text style={styles.blurb}>
              Indemni is a family where every gamer matters, full of unique and awesome people who
              love gaming — just like you.
            </Text>
          </View>

          <Text style={styles.blurbAccent}>When you’re ready to join us… let’s begin.</Text>

          <View style={styles.cta}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleCreate}
              activeOpacity={0.9}
              hitSlop={{ top: 40, bottom: 40, left: 30, right: 30 }}
            >
              <Text style={styles.primaryButtonText}>I’m Ready — Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('SignIn')}
              activeOpacity={0.9}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.secondaryButtonText}>I already have an account</Text>
            </TouchableOpacity>

            {/* Clear state caches (optional while testing) */}
            <TouchableOpacity
              style={[styles.secondaryButton, { marginTop: 8, backgroundColor: '#bc2c2cff' }]}
              onPress={async () => {
                await clearAllPersistence();
                Alert.alert('Cleared', 'Persistent state + caches cleared.');
              }}
              activeOpacity={0.9}
            >
              <Text style={[styles.secondaryButtonText, { color: '#ddd' }]}>
                Clear persistence (dev)
              </Text>
            </TouchableOpacity>

          </View>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  bgDimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, .05)',
  },
  overlay: {
    position: 'absolute',
    width: width,
    height: height,
  },

  // Header block
  headerContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'absolute',
    width: 1,
    height: 1,
  },
  titleWrapper: {
    position: 'absolute',
  },
  wordmark: {
    color: '#fff',
    fontSize: 70,
    fontFamily: Fonts.RoadRage,
    marginTop: 130,
    marginLeft: 30, //
    marginRight: 30,
    textAlign: 'center',
    letterSpacing: 2,
  },

  // Body
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'center',
    marginBottom: 10,
  },
  h1: {
    color: '#121212',
    fontSize: 32,
    marginBottom: 12,
    fontFamily: Fonts.BarlowCondensed700Italic,
  },
  textBlock: {
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: 10,
  },
  blurb: {
    color: '#121212',
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: Fonts.BarlowCondensed700Italic,
  },
  blurbAccent: {
    color: '#ef1f65',
    fontSize: 18,
    textAlign: 'center',
    marginTop: -12,
    fontFamily: Fonts.RoadRage,
    textShadowColor: '#000',
  },

  // Buttons
  cta: {
    width: '100%',
    maxWidth: 560,
    marginTop: 28,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.35,
    shadowRadius: 8.3,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#0b190c',
    fontSize: 16,
    fontFamily: Fonts.InterBold,
  },
  secondaryButton: {
    marginTop: 14,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 30,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e1ee6',
  },
  secondaryButtonText: {
    color: '#eff1f3',
    fontSize: 14,
    fontFamily: Fonts.InterBold,
  },
});
