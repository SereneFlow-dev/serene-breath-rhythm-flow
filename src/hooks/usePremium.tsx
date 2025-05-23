
import { useState, useEffect, createContext, useContext } from 'react';

interface PremiumContextType {
  isPremium: boolean;
  purchasePremium: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  isLoading: boolean;
}

const PremiumContext = createContext<PremiumContextType>({
  isPremium: false,
  purchasePremium: async () => false,
  restorePurchases: async () => false,
  isLoading: false,
});

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

export const PremiumProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check premium status from localStorage
    const premiumStatus = localStorage.getItem('sereneflow-premium');
    setIsPremium(premiumStatus === 'true');
  }, []);

  const purchasePremium = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Here you would integrate with Google Play Billing
      // For now, we'll simulate the purchase
      console.log('Initiating premium purchase...');
      
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set premium status
      localStorage.setItem('sereneflow-premium', 'true');
      localStorage.setItem('sereneflow-premium-date', new Date().toISOString());
      setIsPremium(true);
      
      return true;
    } catch (error) {
      console.error('Purchase failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Here you would check with Google Play for existing purchases
      console.log('Restoring purchases...');
      
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, check if there's a premium date stored
      const premiumDate = localStorage.getItem('sereneflow-premium-date');
      if (premiumDate) {
        setIsPremium(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Restore failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isPremium,
    purchasePremium,
    restorePurchases,
    isLoading,
  };

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
};
