import { Request } from 'express';

export interface GoogleProfile {
  id: string;
  emails: { value: string; verified: boolean }[];
  name: { givenName: string; familyName: string };
  photos: { value: string }[];
}

export interface AuthenticatedUser {
  id?: string;
  _id?: string;
  email: string;
}

export interface JwtPayload {
  email: string;
  _id: string;
}

export interface RefreshTokenPayload {
  _id: string;
}

export interface LoginResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthenticatedUser;
  };
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
