'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';

import { registerAction, type AuthActionState } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialState: AuthActionState = {};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="gradient-blue w-full" disabled={pending}>
      {pending ? 'Creating account...' : 'Create account'}
    </Button>
  );
};

const RegisterForm = () => {
  const [state, formAction] = useFormState(registerAction, initialState);

  return (
    <div className="auth-card">
      <h1 className="text-24-semibold mb-2 text-white">Create an account</h1>
      <p className="mb-6 text-sm text-blue-100">Join Recollab and start collaborating instantly.</p>
      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
          />
        </div>
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
            autoComplete="new-password"
            minLength={8}
          />
        </div>
        {state?.error && (
          <p className="text-sm text-red-400">{state.error}</p>
        )}
        <SubmitButton />
      </form>
      <p className="mt-6 text-center text-sm text-blue-100">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-blue-400 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
