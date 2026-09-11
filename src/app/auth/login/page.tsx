'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const inputClass =
  'h-11 w-full border border-border bg-white px-3 text-sm text-brand-dark placeholder:text-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30';

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const sendOtp = async () => {
    const trimmed = phone.replace(/\D/g, '');
    if (trimmed.length < 10) {
      toast.error('Enter a valid 10-digit phone number');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await api.post<{ expiresIn: number; devOtp?: string }>('/customer/send-otp', {
        phone: trimmed,
        countryCode: '91',
      });
      setOtpSent(true);
      toast.success(
        res.data?.devOtp ? `OTP sent. Dev code: ${res.data.devOtp}` : 'OTP sent to your phone',
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedPhone = phone.replace(/\D/g, '');
    if (trimmedPhone.length < 10) {
      toast.error('Enter a valid phone number');
      return;
    }
    if (!otpSent) {
      await sendOtp();
      return;
    }
    if (otp.length < 4) {
      toast.error('Enter the OTP sent to your phone');
      return;
    }

    setIsVerifying(true);
    try {
      await api.post('/customer/verify-otp', {
        phone: trimmedPhone,
        otp,
        countryCode: '91',
        deviceType: 'WEB',
      });
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Welcome back!');
      router.push('/');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Invalid OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col px-4 py-20">
      <h1 className="text-center text-2xl font-bold tracking-wide text-brand-dark">LOGIN</h1>

      <form onSubmit={verifyOtp} className="mt-10 space-y-4">
          <div>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setOtpSent(false);
                setOtp('');
              }}
              className={inputClass}
            />
          </div>

          {otpSent && (
            <div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className={inputClass}
                autoFocus
              />
            </div>
          )}

          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={sendOtp}
              disabled={isSendingOtp}
              className={cn(
                'text-sm text-[#6366f1] hover:underline disabled:opacity-60',
              )}
            >
              {otpSent ? 'Resend OTP' : 'Send OTP'}
            </button>
          </div>

          <button
            type="submit"
            disabled={isVerifying || isSendingOtp}
            className="mt-2 h-11 w-full rounded-md bg-[#e91e8c] text-sm font-semibold text-white transition-colors hover:bg-[#d4187d] disabled:opacity-60"
          >
            {otpSent ? (isVerifying ? 'Signing in…' : 'Sign In') : isSendingOtp ? 'Sending OTP…' : 'Send OTP'}
          </button>
      </form>

      <p className="mt-10 text-center text-sm text-brand-secondary">
        New users are registered automatically when you sign in with your phone.
      </p>
    </div>
  );
}
