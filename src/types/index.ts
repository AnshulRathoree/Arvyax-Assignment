export interface User {
  _id: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface Session {
  _id: string;
  user_id: string;
  title: string;
  tags: string[];
  json_file_url: string;
  status: 'draft' | 'published';
  created_at: Date;
  updated_at: Date;
}

export interface CreateSessionData {
  title: string;
  tags: string[];
  json_file_url: string;
  status: 'draft' | 'published';
}

export interface UpdateSessionData {
  title?: string;
  tags?: string[];
  json_file_url?: string;
  status?: 'draft' | 'published';
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    created_at: Date;
  };
}

export interface SessionResponse {
  _id: string;
  title: string;
  tags: string[];
  json_file_url: string;
  status: 'draft' | 'published';
  created_at: Date;
  updated_at: Date;
}

export interface MongooseSession {
  _id?: string;
  title: string;
  tags: string[];
  json_file_url: string;
  status: 'draft' | 'published';
  created_at: Date;
  updated_at: Date;
  user_id?: {
    email?: string;
  };
}
