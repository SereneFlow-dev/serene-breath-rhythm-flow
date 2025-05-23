
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import OTPVerification from "./OTPVerification";

interface SignupFormProps {
  onUserChange: (user: any) => void;
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onUserChange, onSwitchToLogin }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);

  const handleSignUp = async () => {
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (result.error) {
        throw result.error;
      }

      if (result.data.user && !result.data.session) {
        // Email verification required
        setShowOTPVerification(true);
        toast.success("OTP sent! Please check your email");
      } else if (result.data.user && result.data.session) {
        // Auto-confirmed (shouldn't happen with email verification enabled)
        onUserChange(result.data.user);
        toast.success("Account created successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  if (showOTPVerification) {
    return (
      <OTPVerification
        email={email}
        onVerified={onUserChange}
        onBack={() => setShowOTPVerification(false)}
        password={password}
        fullName={fullName}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-slate-800 dark:text-slate-200 font-medium">Full Name</Label>
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          className="mt-2 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600"
        />
      </div>

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
          placeholder="Minimum 6 characters"
          className="mt-2 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600"
        />
      </div>

      <div>
        <Label className="text-slate-800 dark:text-slate-200 font-medium">Confirm Password</Label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          className="mt-2 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600"
        />
      </div>

      <Button 
        onClick={handleSignUp} 
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
