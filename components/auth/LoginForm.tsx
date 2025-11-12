'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';

import { loginAction, type AuthActionState } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialState: AuthActionState = {};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="gradient-blue w-full" disabled={pending}>
      {pending ? 'Signing in...' : 'Sign in'}
    </Button>
  );
};

const LoginForm = () => {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <div className="auth-card">
      <h1 className="text-24-semibold mb-2 text-white">Welcome back</h1>
      <p className="mb-6 text-sm text-blue-100">Sign in to continue collaborating.</p>
      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            minLength={8}
          />
        </div>
        {state?.error && (
          <p className="text-sm text-red-400">{state.error}</p>
        )}
        <SubmitButton />
      </form>
      <p className="mt-6 text-center text-sm text-blue-100">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-blue-400 underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
