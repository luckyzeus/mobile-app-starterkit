// src/components/LoaderOne.tsx
import React, { useRef } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { BlurView } from 'expo-blur';
import { useAssetsStore } from '../../state/client/assetsStore';

const { width, height } = Dimensions.get('window');

type Props = { isVisible: boolean };

export default function LoaderOne({ isVisible }: Props) {
  const videoRef = useRef<Video>(null);
  const loaderUri = useAssetsStore((s) => s.cachedAssets.loaderOne as string | undefined);

  if (!isVisible) return null;

  return (
    <>
      {/* Full-screen blur/dim backdrop */}
      <BlurView intensity={80} tint="dark" style={styles.backgroundBlur} />

      {/* Loader circle with looping video */}
      <View style={styles.loaderContainer}>
        {loaderUri ? (
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: loaderUri }}
            isLooping
            shouldPlay
            resizeMode={ResizeMode.COVER}
          />
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundBlur: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 100,
  },
  loaderContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height / 2 - 200,
    left: width / 2 - 100,
    backgroundColor: 'white',
    zIndex: 101,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
