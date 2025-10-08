// src/app/AssetsBootstrap.tsx
import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import { useAssetsStore } from '../state/client/assetsStore';

type Props = { holdSplash?: boolean };

export default function AssetsBootstrap({ holdSplash = true }: Props) {
  const setCachedAssets = useAssetsStore((s) => s.setCachedAssets);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (holdSplash) await SplashScreen.preventAutoHideAsync().catch(() => { });
        // Only preload what truly needs a file:// URI
        const launchVideo = Asset.fromModule(
          require('../../assets/launch/logo-reveal.mp4')
        );
        const signUpVideo = Asset.fromModule(
          require('../../assets/signup/signup-video.mp4')
        );
        const loaderOne = Asset.fromModule(
          require('../../assets/loaders/loader-one.mp4')
        );

        await Promise.all([launchVideo.downloadAsync(), signUpVideo.downloadAsync(), loaderOne.downloadAsync()]);

        if (!mounted) return;

        setCachedAssets({
          launchVideo: launchVideo.localUri ?? launchVideo.uri,
          signUpVideo: signUpVideo.localUri ?? signUpVideo.uri,
          loaderOne: loaderOne.localUri ?? loaderOne.uri,
        });
      } finally {
        if (holdSplash) await SplashScreen.hideAsync().catch(() => { });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [setCachedAssets, holdSplash]);

  return null;
}
