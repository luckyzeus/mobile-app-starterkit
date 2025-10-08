// src/screens/launch/AppLaunchScreen.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Image } from 'expo-image';
import { useAssetsStore } from '../../state/client/assetsStore';

type Props = { onAnimationEnd: () => void; maxDurationMs?: number };

export default function AppLaunchScreen({ onAnimationEnd, maxDurationMs = 4500 }: Props) {
  const videoRef = useRef<Video>(null);
  const [started, setStarted] = useState(false);
  const finishedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 👉 URI was preloaded by AssetsBootstrapper and stored in Zustand
  const launchVideoUri = useAssetsStore((s) => s.cachedAssets.launchVideo as string | undefined);
  const logoBlack = useAssetsStore((s) => s.cachedAssets.logoBlack);
  const setCachedAssets = useAssetsStore((s) => s.setCachedAssets);

  const cleanupVideo = useCallback(async () => {
    try {
      await videoRef.current?.unloadAsync();
    } catch {
      // ignore unload errors
    } finally {
      // Clear reference to hint GC and avoid reusing after launch
      setCachedAssets({ launchVideo: undefined });
    }
  }, [setCachedAssets]);

  const finish = useCallback(async () => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    await cleanupVideo();

    // Small delay so navigation feels smooth after the last frame
    setTimeout(() => {
      onAnimationEnd();
    }, 120);
  }, [cleanupVideo, onAnimationEnd]);

  useEffect(() => {
    // Hard stop in case the video never calls didJustFinish
    timeoutRef.current = setTimeout(finish, maxDurationMs);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [finish, maxDurationMs]);

  const onStatus = (s: any) => {
    if (!s || !('isLoaded' in s)) return;
    if (s.isLoaded && !started) setStarted(true);
    if (s.isLoaded && s.didJustFinish) finish();
  };

  return (
    <View style={styles.container}>
      {launchVideoUri ? (
        <Video
          ref={videoRef}
          source={{ uri: launchVideoUri }}
          style={StyleSheet.absoluteFillObject}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isMuted={Platform.OS === 'web'} // allow autoplay on web
          isLooping={false}
          onPlaybackStatusUpdate={onStatus}
          onError={(_e) => finish()}
        />
      ) : (
        // Fallback still while waiting for preloaded URI (or if preload failed)

        !launchVideoUri && logoBlack ? (
          <Image source={logoBlack} style={StyleSheet.absoluteFillObject} contentFit="cover" />
        ) : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
});
