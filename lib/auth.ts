"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { connectToDatabase } from "./db";
import SessionModel from "./models/Session";
import UserModel from "./models/User";
import { getUserColor } from "./utils";
import type { AuthUser } from "@/types/auth";

const SESSION_COOKIE_NAME = 'recollab_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

const generateSessionToken = () => crypto.randomBytes(32).toString('hex');

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

const setSessionCookie = (token: string, expiresAt: Date) => {
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
};

const clearSessionCookie = () => {
  cookies().delete(SESSION_COOKIE_NAME);
};

export const createSession = async (userId: string) => {
  await connectToDatabase();

  const token = generateSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await SessionModel.create({
    user: userId,
    tokenHash,
    expiresAt,
  });

  setSessionCookie(token, expiresAt);
};

export const deleteSession = async (token?: string | null) => {
  if (!token) {
    clearSessionCookie();
    return;
  }

  await connectToDatabase();

  const tokenHash = hashToken(token);
  await SessionModel.deleteOne({ tokenHash });

  clearSessionCookie();
};

export const getSessionTokenFromCookie = async () => {
  return cookies().get(SESSION_COOKIE_NAME)?.value ?? null;
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const token = await getSessionTokenFromCookie();
  if (!token) return null;

  await connectToDatabase();

  const tokenHash = hashToken(token);

  const session = await SessionModel.findOne({ tokenHash })
    .populate('user')
    .lean();

  if (!session) {
    clearSessionCookie();
    return null;
  }

  const { expiresAt } = session;
  if (expiresAt < new Date()) {
    await SessionModel.deleteOne({ _id: session._id });
    clearSessionCookie();
    return null;
  }

  const userDoc = session.user as any;
  if (!userDoc) {
    clearSessionCookie();
    return null;
  }

  const color = userDoc.color ?? getUserColor(userDoc._id.toString());

  return {
    id: userDoc._id.toString(),
    email: userDoc.email,
    name: userDoc.name ?? undefined,
    avatarUrl: userDoc.avatarUrl ?? undefined,
    color,
  };
};

export const requireUser = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return user;
};
