'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useDebounce } from '@/hooks/useDebounce';
import { decrypt, encrypt } from '@/lib/crypto';

export default function VendorLoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });

    // Debounced values for validation
    const debouncedEmail = useDebounce(formData.email, 500);
    const debouncedPassword = useDebounce(formData.password, 300);

    // Email validation
    const emailError = useMemo(() => {
        if (!touched.email || !debouncedEmail) return '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(debouncedEmail) ? 'Please enter a valid email address' : '';
    }, [debouncedEmail, touched.email]);

    // Password validation
    const passwordError = useMemo(() => {
        if (!touched.password || !debouncedPassword) return '';
        if (debouncedPassword.length < 8) return 'Password must be at least 8 characters';
        return '';
    }, [debouncedPassword, touched.password]);

    // Check if form is valid
    const isFormValid = useMemo(() => {
        return (
            formData.email.length > 0 &&
            formData.password.length >= 8 &&
            !emailError &&
            !passwordError
        );
    }, [formData.email, formData.password, emailError, passwordError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        // Handle login logic here
        const encryptedEmail = encrypt(JSON.stringify(formData));
        console.log('Login attempt:', encryptedEmail);
    };

    const handleBlur = (field: 'email' | 'password') => {
        setTouched({ ...touched, [field]: true });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 to-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 relative">
                            <div className="relative w-20 h-20">
                                <Link href="/">
                                    <Image
                                        src="/images/ministry-logo.png"
                                        alt="Ministry Logo"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </Link>
                        </div>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendor Login</h1>
                    <p className="text-sm text-gray-600">Access your contractor dashboard</p>
                </div>

                {/* Login Card */}
                <Card className="border-gray-200 shadow-lg">
                    <CardContent className="p-8">
                        <p className="text-sm text-gray-600 mb-6 text-center">
                            Enter your credentials to access your account
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Address */}
                            <div>
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your-email@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onBlur={() => handleBlur('email')}
                                    className={`mt-1.5 bg-gray-50 ${
                                        emailError ? 'border-red-500 focus-visible:ring-red-500' : 
                                        touched.email && !emailError && debouncedEmail ? 'border-green-500 focus-visible:ring-green-500' : 
                                        'border-gray-300'
                                    }`}
                                    required
                                />
                                {emailError && (
                                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                                        <FaTimesCircle /> {emailError}
                                    </p>
                                )}
                                {!emailError && touched.email && debouncedEmail && (
                                    <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                                        <FaCheckCircle /> Valid email address
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Password
                                    </Label>
                                    <Link 
                                        href="/forgot-password" 
                                        className="text-xs text-theme-green hover:text-theme-green/80 font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative flex-1">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        onBlur={() => handleBlur('password')}
                                        className={`bg-gray-50 pr-10 ${
                                            passwordError ? 'border-red-500 focus-visible:ring-red-500' : 
                                            touched.password && !passwordError && debouncedPassword ? 'border-green-500 focus-visible:ring-green-500' : 
                                            'border-gray-300'
                                        }`}
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
                                {passwordError && (
                                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                                        <FaTimesCircle /> {passwordError}
                                    </p>
                                )}
                                {!passwordError && touched.password && debouncedPassword && formData.password.length >= 8 && (
                                    <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                                        <FaCheckCircle /> Password meets requirements
                                    </p>
                                )}
                            </div>

                            {/* Sign In Button */}
                            <Button
                                type="submit"
                                title='Submit form'
                                disabled={!isFormValid}
                                className="w-full bg-theme-green hover:bg-theme-green/90 text-white h-11 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sign In
                            </Button>

                            {/* Register Link */}
                            <div className="text-center pt-2">
                                <p className="text-sm text-gray-600">
                                    Don&apos;t have an account?{' '}
                                    <Link 
                                        href="/register" 
                                        className="text-theme-green hover:text-theme-green/80 font-semibold"
                                    >
                                        Register your company
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Imo State Bureau of Public Procurement & Infrastructure
                    </p>
                </div>
            </div>
        </div>
    );
}
