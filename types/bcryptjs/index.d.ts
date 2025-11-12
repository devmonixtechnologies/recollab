declare module 'bcryptjs' {
  export function genSaltSync(rounds?: number): string;
  export function hashSync(data: string, salt?: string | number): string;
  export function compareSync(data: string, encrypted: string): boolean;

  export function hash(data: string, salt: string | number): Promise<string>;
  export function hash(
    data: string,
    salt: string | number,
    callback: (err: Error | null, encrypted?: string) => void
  ): void;

  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function compare(
    data: string,
    encrypted: string,
    callback: (err: Error | null, same: boolean) => void
  ): void;
}
