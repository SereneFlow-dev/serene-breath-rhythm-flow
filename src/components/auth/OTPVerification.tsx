
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface OTPVerificationProps {
  email?: string;
  phone?: string;
  onVerified: (user: any) => void;
  onBack: () => void;
  password: string;
  fullName: string;
}

const OTPVerification = ({ email, phone, onVerified, onBack, password, fullName }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      let result;
      
      if (email) {
        result = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'signup'
        });
      } else if (phone) {
        result = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: 'sms'
        });
      }

      if (result?.error) {
        throw result.error;
      }

      if (result?.data?.user) {
        // Update user profile with additional info
        await supabase
          .from('profiles')
          .upsert({
            id: result.data.user.id,
            full_name: fullName,
            phone: phone || null
          });

        onVerified(result.data.user);
        toast.success("Account verified successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      let result;
      
      if (email) {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone || null
            }
          }
        });
      } else if (phone) {
        result = await supabase.auth.signUp({
          phone,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
      }

      if (result?.error) {
        throw result.error;
      }

      setResendTimer(60);
      setCanResend(false);
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Verify Your Account
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          We've sent a 6-digit code to {email || phone}
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
          {isLoading ? "Verifying..." : "Verify OTP"}
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
          Back to Registration
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
