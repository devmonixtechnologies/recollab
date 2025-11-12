'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useAuth } from '@/components/auth/AuthProvider';
import LogoutButton from '@/components/auth/LogoutButton';

const fallbackAvatar = '/assets/icons/avatar-placeholder.svg';

const UserMenu = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Link href="/sign-in" className="text-sm text-blue-400 underline">
        Sign in
      </Link>
    );
  }

  const initials = user.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || user.email[0]?.toUpperCase() || 'U';
  const avatarSrc = user.avatarUrl || fallbackAvatar;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="relative size-10 overflow-hidden rounded-full bg-dark-400 text-sm font-semibold text-white">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={user.name ?? user.email}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center">{initials}</span>
          )}
        </div>
        <div className="hidden flex-col text-left sm:flex">
          <span className="text-sm font-medium text-white">{user.name ?? user.email}</span>
          <span className="text-xs text-blue-100">{user.email}</span>
        </div>
      </div>
      <LogoutButton variant="secondary" size="sm" />
    </div>
  );
};

export default UserMenu;
