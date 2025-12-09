'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';
import { useDebounce } from '@/hooks/useDebounce';
import { copyToClipboard } from '@/lib';

interface Step1AccountProps {
    formData: {
        fullName: string;
        email: string;
        phone: string;
        password: string;
        confirmPassword: string;
    };
    isLoading: boolean;
    onInputChange: (field: string, value: string) => void;
    onContinue?: () => void;
}

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    bgColor: string;
    message: string;
}

export default function Step1Account({ formData, onInputChange, onContinue, isLoading }: Step1AccountProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        
        onInputChange('password', password);
        onInputChange('confirmPassword', password);
        copyToClipboard(password, 'Password copied to clipboard');
        setShowPassword(true);
    };
    
    // Debounced values for validation
    const debouncedEmail = useDebounce(formData.email, 500);
    const debouncedPhone = useDebounce(formData.phone, 500);

    // Email validation
    const emailError = useMemo(() => {
        if (!debouncedEmail) return '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(debouncedEmail) ? 'Please enter a valid email address' : '';
    }, [debouncedEmail]);

    // Phone validation
    const phoneError = useMemo(() => {
        if (!debouncedPhone) return '';
        const phoneRegex = /^(\+234|0)[0-9]{10}$/;
        return !phoneRegex.test(debouncedPhone.replace(/\s/g, '')) ? 'Please enter a valid Nigerian phone number' : '';
    }, [debouncedPhone]);

    // Password strength calculation
    const passwordStrength = useMemo((): PasswordStrength => {
        const password = formData.password;
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
    }, [formData.password]);

    // Password match validation
    const passwordMatchError = useMemo(() => {
        if (!formData.confirmPassword) return '';
        return formData.password !== formData.confirmPassword ? 'Passwords do not match' : '';
    }, [formData.password, formData.confirmPassword]);

    // Full name validation
    const fullNameError = useMemo(() => {
        if (!formData.fullName) return '';
        if (formData.fullName.length < 3) return 'Name must be at least 3 characters';
        if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) return 'Name should only contain letters';
        return '';
    }, [formData.fullName]);

    // Password validation error
    const passwordError = useMemo(() => {
        if (!formData.password) return '';
        if (formData.password.length < 8) return 'Password must be at least 8 characters';
        if (passwordStrength.score < 100) return 'Password does not meet all requirements';
        return '';
    }, [formData.password, passwordStrength.score]);

    return (
        <div className="space-y-5">
            {/* Full Name */}
            <div>
                <Label htmlFor="fullName">Full Name (Contact Person) <span className="text-red-500">*</span></Label>
                <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    disabled={isLoading}
                    onChange={(e) => onInputChange('fullName', e.target.value)}
                    className={`mt-1.5 ${fullNameError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    required
                />
                {fullNameError && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <FaTimesCircle /> {fullNameError}
                    </p>
                )}
                {!fullNameError && formData.fullName && formData.fullName.length >= 3 && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <FaCheckCircle /> Valid name
                    </p>
                )}
            </div>

            {/* Email and Phone */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        disabled={isLoading}
                        onChange={(e) => onInputChange('email', e.target.value)}
                        className={`mt-1.5 ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        required
                    />
                    {emailError && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                            <FaTimesCircle /> {emailError}
                        </p>
                    )}
                    {!emailError && debouncedEmail && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <FaCheckCircle /> Valid email address
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="+234 xxx xxx xxxx"
                        value={formData.phone}
                        disabled={isLoading}
                        onChange={(e) => onInputChange('phone', e.target.value)}
                        className={`mt-1.5 ${phoneError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        required
                    />
                    {phoneError && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                            <FaTimesCircle /> {phoneError}
                        </p>
                    )}
                    {!phoneError && debouncedPhone && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <FaCheckCircle /> Valid phone number
                        </p>
                    )}
                </div>
            </div>

            {/* Password */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={generatePassword}
                        disabled={isLoading}
                        className="h-7 text-xs text-theme-green hover:text-theme-green/80 hover:bg-green-50"
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
                        value={formData.password}
                        disabled={isLoading}
                        onChange={(e) => onInputChange('password', e.target.value)}
                        className={`pr-10 ${passwordError && formData.password.length >= 8 ? 'border-orange-400 focus-visible:ring-orange-400' : ''}`}
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
                {formData.password && (
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
                                {!formData.password.length && (
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
                                
                                {formData.password.length > 0 && formData.password.length < 8 && (
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
                                
                                {formData.password.length > 0 && !/[A-Z]/.test(formData.password) && (
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
                                
                                {formData.password.length > 0 && !/[a-z]/.test(formData.password) && (
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
                                
                                {formData.password.length > 0 && !/[0-9]/.test(formData.password) && (
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
                                
                                {formData.password.length > 0 && !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) && (
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
                        value={formData.confirmPassword}
                        onChange={(e) => onInputChange('confirmPassword', e.target.value)}
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
                {!passwordMatchError && formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <FaCheckCircle /> Passwords match
                    </p>
                )}
            </div>

            {/* Continue Button */}
            {onContinue && (
                <div className="mt-8 pt-6 border-t">
                    <Button
                        onClick={onContinue}
                        disabled={isLoading}
                        className="w-full bg-theme-green hover:bg-theme-green/90"
                    >
                        Continue
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Button>
                </div>
            )}
        </div>
    );
}
