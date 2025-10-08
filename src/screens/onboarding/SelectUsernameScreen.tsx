import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useOnboardingStore } from '../../state/client/onboardingStore';
import { useUserStore } from '../../state/client/userStore';
import { auth, data } from '../../services/switchboard';
import { checkUsernameAvailable, reserveUsername } from '../../services/user/api';
import { Fonts } from '../../theme/typography';
import { useForm, Controller } from 'react-hook-form';

type Props = { navigation: any };
type FormValues = { username: string };

export default function SelectUsernameScreen({ navigation }: Props) {
  // const onboardingUsername = useOnboardingStore((s) => s.onboardingUsername);
  // const setOnboardingUsername = useOnboardingStore((s) => s.setOnboardingUsername);

  // global stores
  const onboardingUsername = useOnboardingStore((s) => s.onboardingUsername);
  const setOnboardingUsername = useOnboardingStore((s) => s.setOnboardingUsername);
  const setHasStarted = useOnboardingStore((s) => s.setHasStarted);

  const setUidStore = useUserStore((s) => s.setUid);
  const setUsernameStore = useUserStore((s) => s.setUsername);

  // ui state
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [hideContent, setHideContent] = useState(false);

  const [name, setName] = useState(onboardingUsername ?? '');

  // form
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { username: '' }
  });
  const username = watch('username');

  useEffect(() => {
    setValue('username', onboardingUsername);
  }, [setValue, onboardingUsername]);

  // debounced username check
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkUsernameAvailability = (value: string) => {
    const v = value.toLowerCase().trim();
    if (!v || v.length < 2 || v.length > 21 || !/^(?!.*\s\s)(?!.*\s$)[a-zA-Z0-9_ ]+$/.test(v)) {
      setUsernameAvailable(null);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const ok = await checkUsernameAvailable(v);
      setUsernameAvailable(ok);
    }, 400);
  };

  // submit → sign-in (mock today), reserve username, upsert user, move next
  const onSubmit = async (form: FormValues) => {
    const uname = form.username.trim();
    if (!usernameAvailable) return;

    // ensure we have a uid (managed/mock path returns a static)
    let current = (auth as any).currentUser?.();
    if (!current?.uid && (auth as any).signIn) {
      try { current = await (auth as any).signIn(); } catch { }
    }
    const uid = current?.uid ?? 'dev_001';

    // reserve the username (seed mode adds to Set; live writes /Usernames/{lower})
    await reserveUsername(uid, uname);

    // create/merge a minimal user record
    await data.upsertUser({ uid, username: uname, hasFinishedOnboarding: false, newUser: true, isLoggedIn: true });

    // local state
    setOnboardingUsername(uname);
    setUsernameStore(uname);
    setUidStore(uid);
    setHasStarted(true);

    setHideContent(true);
    navigation.navigate('SignUp');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <StatusBar style='dark' />
      <Image
        source={require('../../../assets/background/default-bg.jpg')}
        style={styles.backgroundImage}
        contentFit='fill'
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>The First Step</Text>
          <Text style={styles.sub}>Introduce Yourself</Text>
          <Text style={styles.desc}>
            Your username is your identity and an expression of who you are – choose wisely!
          </Text>

          <View style={styles.inputBlock}>
            <Controller
              control={control}
              rules={{
                required: true,
                minLength: 2,
                maxLength: 21,
                pattern: /^(?!.*\s\s)(?!.*\s$)[a-zA-Z0-9_ ]+$/
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  placeholder="Username"
                  onBlur={(e) => {
                    onBlur();
                    checkUsernameAvailability(value);
                  }}
                  onChangeText={(text) => {
                    onChange(text);
                    checkUsernameAvailability(text);
                  }}
                  value={value}
                />
              )}
              name="username"
            />

            <View style={styles.validationContainer}>
              <View style={styles.validationItem}>
                <Text style={[
                  styles.validationText,
                  username.length >= 2 && username.length <= 21 &&
                    /^(?!.*\s\s)(?!.*\s$)[a-zA-Z0-9_ ]+$/.test(username)
                    ? styles.validText : styles.invalidText
                ]}>
                  Must be 2–21 chars; letters, numbers, spaces, underscores.
                </Text>
              </View>

              <View style={styles.validationItem}>
                {username.length > 0 && username.length >= 2 && username.length <= 21 && (
                  <Text style={[
                    styles.validationText,
                    usernameAvailable === null ? styles.checkingText
                      : usernameAvailable ? styles.validText : styles.invalidText
                  ]}>
                    {usernameAvailable === null ? 'Checking availability...'
                      : usernameAvailable ? 'Username available!'
                        : 'Username is unavailable'}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              (!usernameAvailable || errors.username || username.length < 2 || username.length > 21 ||
                !/^(?!.*\s\s)(?!.*\s$)[a-zA-Z0-9_ ]+$/.test(username)) && styles.primaryBtnDisabled
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={
              !usernameAvailable || !!errors.username ||
              username.length < 2 || username.length > 21 ||
              !/^(?!.*\s\s)(?!.*\s$)[a-zA-Z0-9_ ]+$/.test(username)
            }
          >
            <Text style={styles.primaryBtnText}>Next</Text>
          </TouchableOpacity>

          <View style={styles.footerSpace} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f7f7f7' },
  container: { flex: 1, padding: 24, zIndex: 2 },
  title: {
    fontFamily: Fonts.BarlowCondensed700Italic,
    fontSize: 44,
    color: '#ef1f65',
    textDecorationLine: 'underline',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 0,
  },
  sub: {
    marginTop: 8,
    fontFamily: Fonts.InterBold,
    fontSize: 22,
    color: '#261f2f',
  },
  desc: {
    marginTop: 8,
    marginBottom: 16,
    fontFamily: Fonts.InterMedium,
    fontSize: 15,
    color: '#474247',
  },
  inputBlock: { marginTop: 12 },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#212121',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    fontFamily: Fonts.InterRegular,
    fontSize: 16,
    color: '#111',
  },
  primaryBtn: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 3
  },
  primaryBtnDisabled: {
    color: '#F6F4F63F',
    opacity: .6,
  },
  primaryBtnText: {
    fontFamily: Fonts.RoadRage,
    fontSize: 28,
    color: '#261f2f',
    letterSpacing: 0.5,
  },
  footerSpace: { height: 12 },
  validationContainer: { marginTop: 14, gap: 8 },
  validationItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  validationText: { fontSize: 13 },
  validText: { color: 'green' },
  invalidText: { color: 'red' },
  checkingText: { color: '#777' }
});
