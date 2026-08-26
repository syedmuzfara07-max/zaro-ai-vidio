export interface AdMobConfig {
  appId: string;
  bannerAdUnitId: string;
  rewardedAdUnitId: string;
  interstitialAdUnitId: string;
  testMode: boolean;
}

export const DEFAULT_ADMOB_CONFIG: AdMobConfig = {
  appId: 'ca-app-pub-3940256099942544~3347511713', // Google AdMob standard test App ID
  bannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111', // Test Banner ID
  rewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917', // Test Rewarded ID
  interstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712',
  testMode: true,
};

export class AdMobService {
  private static adListeners: ((event: string, data?: any) => void)[] = [];

  static addListener(callback: (event: string, data?: any) => void) {
    this.adListeners.push(callback);
    return () => {
      this.adListeners = this.adListeners.filter(cb => cb !== callback);
    };
  }

  static emit(event: string, data?: any) {
    this.adListeners.forEach(cb => cb(event, data));
  }
}
