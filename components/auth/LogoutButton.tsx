'use client';

import { useTransition } from 'react';

import { logoutAction } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';

type LogoutButtonProps = Omit<React.ComponentProps<typeof Button>, 'onClick'> & {
  label?: string;
};

const LogoutButton = ({ label = 'Sign out', ...props }: LogoutButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      void logoutAction();
    });
  };

  return (
    <Button type="button" onClick={handleClick} disabled={isPending} {...props}>
      {isPending ? 'Signing out…' : label}
    </Button>
  );
};

export default LogoutButton;
