'use server';

import { redirect } from 'next/navigation';

import { connectToDatabase } from '@/lib/db';
import { createSession, deleteSession, getSessionTokenFromCookie, hashPassword, verifyPassword } from '@/lib/auth';
import UserModel from '@/lib/models/User';
import { getUserColor } from '@/lib/utils';

const AUTH_REDIRECT_PATH = '/';

export type AuthActionState = {
  error?: string;
};

const normalizeEmail = (value: string) => value.trim().toLowerCase();

export async function registerAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Email and password are required.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' };
  }

  await connectToDatabase();

  const normalizedEmail = normalizeEmail(email);

  const existingUser = await UserModel.findOne({ email: normalizedEmail });
  if (existingUser) {
    return { error: 'An account with this email already exists.' };
  }

  const hashedPassword = await hashPassword(password);

  const user = await UserModel.create({
    email: normalizedEmail,
    password: hashedPassword,
    name: typeof name === 'string' && name.trim().length ? name.trim() : undefined,
  });

  const color = getUserColor(user._id.toString());
  user.color = color;
  await user.save();

  await createSession(user._id.toString());
  redirect(AUTH_REDIRECT_PATH);
}

export async function loginAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Email and password are required.' };
  }

  await connectToDatabase();

  const normalizedEmail = normalizeEmail(email);
  const user = await UserModel.findOne({ email: normalizedEmail });

  if (!user) {
    return { error: 'Invalid email or password.' };
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return { error: 'Invalid email or password.' };
  }

  if (!user.color) {
    user.color = getUserColor(user._id.toString());
    await user.save();
  }

  await createSession(user._id.toString());
  redirect(AUTH_REDIRECT_PATH);
}

export async function logoutAction() {
  const token = await getSessionTokenFromCookie();

  await deleteSession(token);

  redirect('/sign-in');
}
