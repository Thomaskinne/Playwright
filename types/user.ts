export interface User {
  username: string;
  password: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export type UserType = 'standard' | 'locked_out' | 'problem' | 'performance_glitch' | 'error' | 'visual';