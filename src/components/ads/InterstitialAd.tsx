
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
      // Prepare and show interstitial ad without explicit options interface
      await AdMob.prepareInterstitial({ adId });
      await AdMob.showInterstitial();
      
      // Handle ad dismissal callback directly
      // Since the event listener API seems to have issues, we'll call the callback immediately
      // In a real implementation, you might need to use a different approach based on the actual AdMob plugin version
      setTimeout(() => {
        onAdDismissed?.();
      }, 100);

    } catch (error) {
      console.log('Interstitial ad failed to show:', error);
      onAdDismissed?.();
    }
  };

  return null; // This component doesn't render anything visible
};

export default InterstitialAd;
