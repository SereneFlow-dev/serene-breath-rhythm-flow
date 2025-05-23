
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignupForm from "./auth/SignupForm";
import LoginForm from "./auth/LoginForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserChange: (user: any) => void;
}

const AuthModal = ({ isOpen, onClose, onUserChange }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState("login");

  const handleUserChange = (user: any) => {
    onUserChange(user);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white text-center">
            Welcome to SereneFlow
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm 
              onUserChange={handleUserChange} 
              onSwitchToSignup={() => setActiveTab("signup")}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm 
              onUserChange={handleUserChange} 
              onSwitchToLogin={() => setActiveTab("login")}
            />
          </TabsContent>
        </Tabs>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
          You can use the app without an account, but signing up allows you to sync your data across devices.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
