'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useResetPasswordMutation } from '@/store/api/vendor.api';
import { useDebounce } from '@/hooks/useDebounce';
import { FaEye, FaEyeSlash, FaKey } from 'react-icons/fa6';
import { copyToClipboard } from '@/lib';
import { AnimatePresence, motion } from 'framer-motion';

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    bgColor: string;
    message: string;
}

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            router.push('/vendor-login');
        }
    }, [token, router]);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const debouncedPassword = useDebounce(password, 500);
    const debouncedConfirmPassword = useDebounce(confirmPassword, 500);

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    // Password validation
    const passwordError = useMemo(() => {
        if (!debouncedPassword) return '';
        if (debouncedPassword.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(debouncedPassword)) return 'Must contain at least one uppercase letter';
        if (!/[a-z]/.test(debouncedPassword)) return 'Must contain at least one lowercase letter';
        if (!/[0-9]/.test(debouncedPassword)) return 'Must contain at least one number';
        return '';
    }, [debouncedPassword]);

    // Password strength calculation
    const passwordStrength = useMemo((): PasswordStrength => {
        const password = debouncedPassword;
        if (!password) {
            return { score: 0, label: '', color: '', bgColor: '', message: '' };
        }

        let score = 0;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        // Calculate score
        if (checks.length) score += 20;
        if (checks.uppercase) score += 20;
        if (checks.lowercase) score += 20;
        if (checks.number) score += 20;
        if (checks.special) score += 20;

        // Determine strength level
        if (score < 40) {
            return {
                score,
                label: 'Weak',
                color: 'text-red-700',
                bgColor: 'bg-red-500',
                message: 'Add more character types'
            };
        } else if (score < 80) {
            return {
                score,
                label: 'Fair',
                color: 'text-orange-700',
                bgColor: 'bg-orange-500',
                message: 'Almost there, keep going'
            };
        } else if (score < 100) {
            return {
                score,
                label: 'Good',
                color: 'text-blue-700',
                bgColor: 'bg-blue-500',
                message: 'Strong password!'
            };
        } else {
            return {
                score,
                label: 'Excellent',
                color: 'text-green-700',
                bgColor: 'bg-theme-green',
                message: 'Very secure password!'
            };
        }
    }, [debouncedPassword]);

    // Password match validation
    const passwordMatchError = useMemo(() => {
        if (!confirmPassword) return '';
        return password !== confirmPassword ? 'Passwords do not match' : '';
    }, [password, confirmPassword]);

    const passwordsMatch = useMemo(() => {
        if (!debouncedPassword || !debouncedConfirmPassword) return true;
        return debouncedPassword === debouncedConfirmPassword;
    }, [debouncedPassword, debouncedConfirmPassword]);

    // Generate strong password
    const generatePassword = () => {
        const length = 16;
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const allChars = uppercase + lowercase + numbers + special;

        let password = '';
        // Ensure at least one of each type
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];

        // Fill the rest randomly
        for (let i = password.length; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Shuffle the password
        password = password.split('').sort(() => Math.random() - 0.5).join('');

        setPassword(password);
        setConfirmPassword(password);
        copyToClipboard(password, 'Password copied to clipboard');
        setShowPassword(true);
    };

    useEffect(() => {
        if (!token) {
            router.push('/forgot-password');
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!token) return;

        if (passwordError || !passwordsMatch) return;

        try {
            const response = await resetPassword({
                newPassword: password,
                confirmPassword: confirmPassword,
                token,
            });

            if ('error' in response) {
                throw new Error('Failed to reset password');
            }

            setIsSubmitted(true);
        } catch (err) {
            setError('Failed to reset password. Please try again.');
            console.error('Password reset error:', err);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-linear-to-br from-green-50 to-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Card className="border-gray-200 shadow-lg">
                        <CardContent className="p-8 text-center">
                            <div className="mb-6">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                                    <FaCheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful</h1>
                            <p className="text-gray-600 mb-8">
                                Your password has been successfully updated. You can now log in with your new password.
                            </p>
                            <Button
                                onClick={() => router.push('/vendor-login')}
                                className="w-full bg-theme-green hover:bg-theme-green/90"
                            >
                                Back to Login
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 to-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
                    <p className="text-sm text-gray-600">
                        Create a new password for your account
                    </p>
                </div>

                <Card className="border-gray-200 shadow-lg">
                    <CardContent className="p-8">
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* New Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={generatePassword}
                                        disabled={isLoading}
                                        className="h-7 text-xs text-theme-green hover:text-theme-green/80 hover:bg-green-50 cursor-pointer"
                                    >
                                        <FaKey className="mr-1" />
                                        Generate Password
                                    </Button>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Min. 8 characters"
                                        value={password}
                                        disabled={isLoading}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`pr-10 ${passwordError && password.length >= 8 ? 'border-orange-400 focus-visible:ring-orange-400' : ''}`}
                                        required
                                    />
                                    <button
                                        tabIndex={-1}
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="mt-2 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-gray-700">Password Strength:</span>
                                            <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.bgColor}`}
                                                style={{ width: `${passwordStrength.score}%` }}
                                            />
                                        </div>

                                        {/* Requirements Checklist */}
                                        <ul className="text-xs space-y-1 mt-2">
                                            <AnimatePresence mode="popLayout">
                                                {!password.length && (
                                                    <motion.li
                                                        key="empty-password"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span className="text-gray-400">○</span>
                                                        <span className="text-gray-500">Start typing to see requirements</span>
                                                    </motion.li>
                                                )}

                                                {password.length > 0 && password.length < 8 && (
                                                    <motion.li
                                                        key="length"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span className="text-gray-400">○</span>
                                                        <span className="text-gray-500">At least 8 characters</span>
                                                    </motion.li>
                                                )}

                                                {password.length > 0 && !/[A-Z]/.test(password) && (
                                                    <motion.li
                                                        key="uppercase"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span className="text-gray-400">○</span>
                                                        <span className="text-gray-500">One uppercase letter</span>
                                                    </motion.li>
                                                )}

                                                {password.length > 0 && !/[a-z]/.test(password) && (
                                                    <motion.li
                                                        key="lowercase"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span className="text-gray-400">○</span>
                                                        <span className="text-gray-500">One lowercase letter</span>
                                                    </motion.li>
                                                )}

                                                {password.length > 0 && !/[0-9]/.test(password) && (
                                                    <motion.li
                                                        key="number"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span className="text-gray-400">○</span>
                                                        <span className="text-gray-500">One number</span>
                                                    </motion.li>
                                                )}

                                                {password.length > 0 && !/[!@#$%^&*(),.?":{}|<>]/.test(password) && (
                                                    <motion.li
                                                        key="special"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span className="text-gray-400">○</span>
                                                        <span className="text-gray-500">One special character (!@#$%^&*)</span>
                                                    </motion.li>
                                                )}
                                            </AnimatePresence>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                                <div className="relative mt-1.5">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Re-enter password"
                                        disabled={isLoading}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`pr-10 ${passwordMatchError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {passwordMatchError && (
                                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                        <FaTimesCircle /> {passwordMatchError}
                                    </p>
                                )}
                                {!passwordMatchError && confirmPassword && password === confirmPassword && (
                                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                        <FaCheckCircle /> Passwords match
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={
                                    isLoading ||
                                    !password ||
                                    !confirmPassword ||
                                    !!passwordError ||
                                    !passwordsMatch
                                }
                                className="w-full bg-theme-green hover:bg-theme-green/90 text-white h-11 text-sm font-medium"
                            >
                                {isLoading ? 'Resetting Password...' : 'Reset Password'}
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-600">
                                Remember your password?{' '}
                                <a
                                    href="/vendor-login"
                                    className="text-theme-green hover:text-theme-green/80 font-medium"
                                >
                                    Sign in
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-green mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}

