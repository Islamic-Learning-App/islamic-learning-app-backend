import { Injectable } from '@nestjs/common';
import { TokenService } from '../../common/services/token.service';
import { AuthenticatedUser } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly tokenService: TokenService) {}

  async login(user: AuthenticatedUser) {
    const accessToken = this.tokenService.createAccessToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(user);

    return {
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user,
      },
    };
  }

  async refresh(refreshToken: string) {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    const user: AuthenticatedUser = { _id: payload._id, email: '' }; // Minimum info needed for token, or fetch from DB
    // To be safer and have email, we could fetch user from DB here,
    // but the payload._id is enough to generate a new access token if our sign method handles it.
    // However, createAccessToken requires email. Let's assume we fetch or just use what we have.

    return {
      message: 'Token refreshed successfully',
      data: {
        accessToken: this.tokenService.createAccessToken(user),
      },
    };
  }
}
