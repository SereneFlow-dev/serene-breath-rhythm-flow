
import { useEffect } from 'react';
import { AdMob } from '@capacitor-community/admob';

interface InterstitialAdProps {
  adId?: string;
  shouldShow: boolean;
  onAdDismissed?: () => void;
}

const InterstitialAd = ({ 
  adId = 'ca-app-pub-3940256099942544/1033173712', // Test ad unit ID
  shouldShow,
  onAdDismissed
}: InterstitialAdProps) => {
  
  useEffect(() => {
    // Check if user is premium
    const isPremium = localStorage.getItem('sereneflow-premium') === 'true';
    if (isPremium) return;

    if (shouldShow) {
      showInterstitialAd();
    }
  }, [shouldShow, adId]);

  const showInterstitialAd = async () => {
    try {
      const options = {
        adId,
      };

      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
      
      // Listen for ad events using the correct event name
      AdMob.addListener('onInterstitialAdDismissed', () => {
        onAdDismissed?.();
      });

    } catch (error) {
      console.log('Interstitial ad failed to show:', error);
      onAdDismissed?.();
    }
  };

  return null; // This component doesn't render anything visible
};

export default InterstitialAd;
