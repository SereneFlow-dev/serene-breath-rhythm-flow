import { useState, useEffect } from "react";
import { BookOpen, Info, Trash2, UserPlus, LogOut, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import SoundHapticSettings from "@/components/SoundHapticSettings";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const {
    user,
    signOut
  } = useAuth();

  useEffect(() => {
    // Always set dark mode
    document.documentElement.classList.add('dark');
    localStorage.setItem('sereneflow-theme', 'dark');
  }, []);

  useEffect(() => {
    // Load user profile when user changes
    if (user) {
      loadUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) {
        console.error('Error loading profile:', error);
        return;
      }
      setUserProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const clearAllData = () => {
    const confirm = window.confirm('Are you sure you want to clear all your local data? This action cannot be undone.');
    if (confirm) {
      localStorage.removeItem('sereneflow-sessions');
      localStorage.removeItem('sereneflow-streak');
      localStorage.removeItem('sereneflow-total-sessions');
      localStorage.removeItem('sereneflow-custom-patterns');
      toast.success('All local data cleared');
    }
  };

  const deleteAccount = async () => {
    const confirm = window.confirm('Are you sure you want to delete your account? This action cannot be undone and will remove all your data.');
    if (confirm && user) {
      try {
        // Delete user data from database
        await supabase.from('sessions').delete().eq('user_id', user.id);
        await supabase.from('custom_patterns').delete().eq('user_id', user.id);
        await supabase.from('profiles').delete().eq('id', user.id);

        // Clear local data
        localStorage.removeItem('sereneflow-sessions');
        localStorage.removeItem('sereneflow-streak');
        localStorage.removeItem('sereneflow-total-sessions');
        localStorage.removeItem('sereneflow-custom-patterns');

        // Sign out user
        await signOut();
        toast.success('Account deleted successfully');
      } catch (error: any) {
        toast.error('Failed to delete account');
        console.error('Error deleting account:', error);
      }
    }
  };

  const exportData = async () => {
    let data: any = {
      exportDate: new Date().toISOString(),
      localData: {
        sessions: JSON.parse(localStorage.getItem('sereneflow-sessions') || '[]'),
        streak: parseInt(localStorage.getItem('sereneflow-streak') || '0'),
        totalSessions: parseInt(localStorage.getItem('sereneflow-total-sessions') || '0'),
        customPatterns: JSON.parse(localStorage.getItem('sereneflow-custom-patterns') || '[]')
      }
    };

    // If user is logged in, also export database data
    if (user) {
      try {
        const [sessionsResult, patternsResult, profileResult] = await Promise.all([supabase.from('sessions').select('*').eq('user_id', user.id), supabase.from('custom_patterns').select('*').eq('user_id', user.id), supabase.from('profiles').select('*').eq('id', user.id).single()]);
        data.databaseData = {
          profile: profileResult.data,
          sessions: sessionsResult.data || [],
          customPatterns: patternsResult.data || []
        };
      } catch (error) {
        console.error('Error exporting database data:', error);
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sereneflow-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleUserChange = (newUser: any) => {
    // User state is handled by AuthProvider
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Failed to logout');
    }
  };

  return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Settings
          </h1>
          <p className="text-slate-700 dark:text-slate-200 font-medium text-base">
            Customize your experience
          </p>
        </div>

        {/* User Account */}
        <Card className="mb-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-slate-100">
              <User className="h-5 w-5 mr-2" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {!user ? <Button onClick={() => setIsAuthModalOpen(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up / Login
              </Button> : <div className="space-y-3">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <p className="text-sm text-indigo-900 dark:text-indigo-100 font-medium">
                    {userProfile?.full_name && <span className="block">Welcome, {userProfile.full_name}!</span>}
                    <span className="block">{user.email || user.phone}</span>
                  </p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="w-full border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-200 dark:hover:bg-indigo-900/30 font-semibold">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>}
          </CardContent>
        </Card>

        {/* Sound & Haptic Settings */}
        <div className="mb-6">
          <SoundHapticSettings />
        </div>

        {/* Learning */}
        <Card className="mb-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 mr-2" />
              Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Button variant="ghost" onClick={() => window.open('/learn', '_blank')} className="w-full justify-start font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-4 w-4 mr-2" />
              Breathing Techniques Guide
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="mb-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-slate-100">
              <Info className="h-5 w-5 mr-2" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <Button variant="outline" onClick={exportData} className="w-full justify-start border-2 border-indigo-300 dark:border-indigo-600 font-semibold text-slate-950 bg-slate-500 hover:bg-slate-400">
              Export My Data
            </Button>
            
            <Button variant="outline" onClick={clearAllData} className="w-full justify-start border-2 border-orange-300 dark:border-orange-600 font-semibold text-[#e22533] text-justify bg-slate-500 hover:bg-slate-400">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Local Data
            </Button>

            {user && <Button variant="outline" className="w-full justify-start border-2 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-200 dark:hover:bg-red-900/30 font-semibold" onClick={deleteAccount}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>}
          </CardContent>
        </Card>

        {/* About */}
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                SereneFlow
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-200 mb-4 font-medium">
                Version 1.0.0
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Your calm breathing companion for stress relief, focus, and mindfulness. 
                Practice mindful breathing techniques anytime, anywhere.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Safety Note */}
        <Alert className="mt-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-amber-900 dark:text-amber-100 font-medium">
            Always practice breathing exercises in a safe environment. Stop if you feel dizzy or uncomfortable.
          </AlertDescription>
        </Alert>
      </div>

      <Navigation />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onUserChange={handleUserChange} />
    </div>;
};

export default Settings;
