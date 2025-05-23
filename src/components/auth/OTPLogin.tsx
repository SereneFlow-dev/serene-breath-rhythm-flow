
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface OTPLoginProps {
  email: string;
  onVerified: (user: any) => void;
  onBack: () => void;
}

const OTPLogin = ({ email, onVerified, onBack }: OTPLoginProps) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    // Send OTP immediately when component mounts
    sendOTP();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const sendOTP = async () => {
    setIsLoading(true);
    try {
      const result = await supabase.auth.signInWithOtp({ email });

      if (result?.error) {
        throw result.error;
      }

      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
      onBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const result = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });

      if (result?.error) {
        throw result.error;
      }

      if (result?.data?.user) {
        onVerified(result.data.user);
        toast.success("Logged in successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setResendTimer(60);
    setCanResend(false);
    await sendOTP();
  };

  if (!otpSent && isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-300">Sending OTP...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Enter OTP
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          We've sent a 6-digit code to {email}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-slate-800 dark:text-slate-200 font-medium">
            Enter 6-digit OTP
          </Label>
          <div className="flex justify-center mt-2">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <Button
          onClick={handleVerifyOTP}
          disabled={otp.length !== 6 || isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
        >
          {isLoading ? "Verifying..." : "Verify & Login"}
        </Button>

        <div className="text-center">
          {!canResend ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Resend OTP in {resendTimer}s
            </p>
          ) : (
            <Button
              variant="ghost"
              onClick={handleResendOTP}
              disabled={isLoading}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Resend OTP
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          onClick={onBack}
          className="w-full border-2 border-slate-300 dark:border-slate-600"
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default OTPLogin;
