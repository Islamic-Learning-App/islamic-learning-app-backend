import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import {
  AuthenticatedUser,
  JwtPayload,
  RefreshTokenPayload,
} from '../../modules/auth/interfaces/auth.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  /**
   * Generates a short-lived access token
   */
  createAccessToken(user: AuthenticatedUser): string {
    const payload: JwtPayload = {
      email: user.email,
      _id: user._id?.toString() || user.id || '',
    };
    return this.jwtService.sign(payload);
  }

  /**
   * Generates a long-lived refresh token and stores it in Redis
   */
  async createRefreshToken(user: AuthenticatedUser): Promise<string> {
    const userId = user._id?.toString() || user.id || '';
    const payload: RefreshTokenPayload = { _id: userId };

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: (this.configService.get<string>('jwt.refreshExpiresIn') || '30d') as any,
    });

    // Store in Redis with 1 month (30 days) TTL
    // Key: refresh_token:<userId>
    const ttlSeconds = 30 * 24 * 60 * 60; // 30 days
    await this.redis.set(`refresh_token:${userId}`, refreshToken, 'EX', ttlSeconds);

    return refreshToken;
  }

  /**
   * Verifies an access token
   */
  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  /**
   * Verifies a refresh token and checks its existence in Redis
   */
  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      const payload = this.jwtService.verify<RefreshTokenPayload>(token);
      const storedToken = await this.redis.get(`refresh_token:${payload._id}`);

      if (!storedToken || storedToken !== token) {
        throw new UnauthorizedException('Refresh token expired or revoked');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Revokes a refresh token by removing it from Redis
   */
  async revokeRefreshToken(userId: string): Promise<void> {
    await this.redis.del(`refresh_token:${userId}`);
  }
}
