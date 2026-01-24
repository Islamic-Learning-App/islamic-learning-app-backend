import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '../../common/decorators/user.decorator';
import { UserGuard } from '../../common/guards/user.guard';
import type { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@Controller('users')
export class UserController {
  @Get('me')
  @UseGuards(UserGuard)
  getProfile(@User() user: AuthenticatedUser) {
    return {
      message: 'User profile retrieved successfully',
      data: user,
    };
  }
}
