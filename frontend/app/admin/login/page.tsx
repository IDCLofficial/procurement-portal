'use client';

import { useLogin } from './_hooks';
import { LoginForm, LoginHeader } from './_components';

export default function Login() {
  const {
    email,
    password,
    showPassword,
    error,
    isLoading,
    setEmail,
    setPassword,
    toggleShowPassword,
    handleSubmit,
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginHeader />

        <LoginForm
          email={email}
          password={password}
          showPassword={showPassword}
          error={error}
          isLoading={isLoading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onToggleShowPassword={toggleShowPassword}
          onSubmit={handleSubmit}
        />

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Secured by Imo State BPPPI • Internal Use Only</p>
        </div>
      </div>
    </div>
  );
}
