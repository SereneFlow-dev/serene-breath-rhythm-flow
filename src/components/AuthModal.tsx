
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserChange: (user: any) => void;
}

const AuthModal = ({ isOpen, onClose, onUserChange }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (method: 'email' | 'phone') => {
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - in real app, this would be a backend call
      const identifier = method === 'email' ? email : phone;
      const user = {
        id: Date.now().toString(),
        email: method === 'email' ? email : '',
        phone: method === 'phone' ? phone : '',
        createdAt: new Date().toISOString(),
      };

      // Save user to localStorage (in real app, this would be handled by backend)
      localStorage.setItem('sereneflow-user', JSON.stringify(user));
      
      onUserChange(user);
      toast.success("Account created successfully!");
      onClose();
      
      // Reset form
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (method: 'email' | 'phone') => {
    setIsLoading(true);

    try {
      // Simulate API call - in real app, this would validate credentials
      const identifier = method === 'email' ? email : phone;
      
      // Check if user exists in localStorage (simplified for demo)
      const existingUser = localStorage.getItem('sereneflow-user');
      if (existingUser) {
        const user = JSON.parse(existingUser);
        onUserChange(user);
        toast.success("Logged in successfully!");
        onClose();
      } else {
        toast.error("User not found. Please sign up first.");
      }
      
      // Reset form
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (error) {
      toast.error("Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white text-center">
            Welcome to SereneFlow
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-slate-800 dark:text-slate-200 font-medium">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-2 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
              
              <div>
                <Label className="text-slate-800 dark:text-slate-200 font-medium">Phone Number (Optional)</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="mt-2 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
              
              <div>
                <Label className="text-slate-800 dark:text-slate-200 font-medium">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="mt-2 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
              
              <div>
                <Label className="text-slate-800 dark:text-slate-200 font-medium">Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="mt-2 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
              
              <Button 
                onClick={() => handleSignUp('email')} 
                disabled={!email || !password || isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-slate-800 dark:text-slate-200 font-medium">Email or Phone</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com or phone"
                  className="mt-2 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
              
              <div>
                <Label className="text-slate-800 dark:text-slate-200 font-medium">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="mt-2 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
              
              <Button 
                onClick={() => handleLogin('email')} 
                disabled={!email || !password || isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
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
