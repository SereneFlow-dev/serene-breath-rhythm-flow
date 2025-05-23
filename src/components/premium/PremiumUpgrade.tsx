
import { useState } from 'react';
import { Crown, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PremiumUpgradeProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const PremiumUpgrade = ({ isOpen, onClose, onUpgrade }: PremiumUpgradeProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      await onUpgrade();
    } finally {
      setIsProcessing(false);
    }
  };

  const premiumFeatures = [
    'Ad-free experience',
    'All breathing techniques unlocked',
    'Advanced progress analytics',
    'Custom breathing patterns',
    'Export session data',
    'Priority customer support'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <CardTitle className="text-xl text-slate-800 dark:text-slate-200">
                Go Premium
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              ₹150
            </div>
            <Badge variant="secondary" className="text-xs">
              One-time payment
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
          
          <div className="pt-4 space-y-3">
            <Button 
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium"
            >
              {isProcessing ? 'Processing...' : 'Upgrade Now'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Secure payment • No subscription • No hidden fees
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumUpgrade;
