
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import OTPLogin from "./OTPLogin";

interface LoginFormProps {
  onUserChange: (user: any) => void;
  onSwitchToSignup: () => void;
}

const LoginForm = ({ onUserChange, onSwitchToSignup }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPLogin, setShowOTPLogin] = useState(false);

  const handlePasswordLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        throw result.error;
      }

      if (result.data.user) {
        onUserChange(result.data.user);
        toast.success("Logged in successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPLogin = () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setShowOTPLogin(true);
  };

  if (showOTPLogin) {
    return (
      <OTPLogin
        email={email}
        onVerified={onUserChange}
        onBack={() => setShowOTPLogin(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-slate-800 dark:text-slate-200 font-medium">Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="mt-2 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600"
        />
      </div>

      <div>
        <Label className="text-slate-800 dark:text-slate-200 font-medium">Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          className="mt-2 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600"
        />
      </div>

      <Button 
        onClick={handlePasswordLogin} 
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
      >
        {isLoading ? "Logging in..." : "Login with Password"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-300 dark:border-slate-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">Or</span>
        </div>
      </div>

      <Button 
        onClick={handleOTPLogin} 
        variant="outline"
        className="w-full border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400"
      >
        Login with OTP
      </Button>

      <div className="text-center">
        <button
          onClick={onSwitchToSignup}
          className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
