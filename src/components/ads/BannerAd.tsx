
import { useEffect, useState } from 'react';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

interface BannerAdProps {
  adId?: string;
  position?: 'TOP_CENTER' | 'BOTTOM_CENTER';
  size?: 'BANNER' | 'LARGE_BANNER' | 'MEDIUM_RECTANGLE';
  className?: string;
}

const BannerAd = ({ 
  adId = 'ca-app-pub-3940256099942544/6300978111', // Test ad unit ID
  position = 'BOTTOM_CENTER',
  size = 'BANNER',
  className = ""
}: BannerAdProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Check if user is premium
    const premiumStatus = localStorage.getItem('sereneflow-premium');
    setIsPremium(premiumStatus === 'true');
  }, []);

  useEffect(() => {
    if (isPremium) return; // Don't show ads to premium users

    const showBannerAd = async () => {
      try {
        const options: BannerAdOptions = {
          adId,
          adSize: size === 'BANNER' ? BannerAdSize.BANNER : 
                  size === 'LARGE_BANNER' ? BannerAdSize.LARGE_BANNER : 
                  BannerAdSize.MEDIUM_RECTANGLE,
          position: position === 'TOP_CENTER' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER,
        };

        await AdMob.showBanner(options);
        setIsLoaded(true);
      } catch (error) {
        console.log('Banner ad failed to load:', error);
      }
    };

    showBannerAd();

    return () => {
      AdMob.hideBanner().catch(console.log);
    };
  }, [adId, position, size, isPremium]);

  // Don't render anything for premium users
  if (isPremium) return null;

  return (
    <div className={`banner-ad-container ${className}`}>
      {!isLoaded && (
        <div className="h-12 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-500">
          Loading ad...
        </div>
      )}
    </div>
  );
};

export default BannerAd;
