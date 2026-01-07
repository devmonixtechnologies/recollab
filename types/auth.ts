export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  color: string;
};

export type UserType = 'editor' | 'viewer';
