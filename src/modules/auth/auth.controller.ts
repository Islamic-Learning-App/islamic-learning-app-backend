import { Controller, Get, Headers, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: AuthenticatedRequest) {
    return await this.authService.login(req.user);
  }

  @Get('refresh')
  async refresh(@Headers('x-refresh-token') refreshToken: string) {
    return await this.authService.refresh(refreshToken);
  }
}
