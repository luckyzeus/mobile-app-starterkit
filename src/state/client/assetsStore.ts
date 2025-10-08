import { create } from 'zustand';
import { ImageSourcePropType } from 'react-native';

// Known keys + open extension
export type AssetKey = 'logoWhite' | 'logoBlack' | 'launchVideo';
type KnownAssets = {
  logoWhite?: ImageSourcePropType;
  logoBlack?: ImageSourcePropType;
  launchVideo?: string;
};
type Assets = KnownAssets & { [key: string]: ImageSourcePropType | string | undefined };

type AssetsState = {
  cachedAssets: Assets;
  setCachedAssets: (a: Partial<Assets>) => void;
};

export const useAssetsStore = create<AssetsState>((set) => ({
  cachedAssets: {
    // set defaults for common asssets using require and skip preloading entirely for images unless it's a heavy image:
    logoWhite: require('../../../assets/launch/logo-white-transparent.png'),
    logoBlack: require('../../../assets/launch/logo-black-transparent.png'),
  },
  setCachedAssets: (a) => set((s) => ({ cachedAssets: { ...s.cachedAssets, ...a } })),
}));
